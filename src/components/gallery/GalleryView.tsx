"use client";

import { YouTubeFacade } from "@/components/YouTubeFacade";
import { gallery } from "@/resources";
import { extractYouTubeId } from "@/utils/youtube";
import { Carousel, Dialog, Flex, Icon, MasonryGrid, Media, Text } from "@once-ui-system/core";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type RawImage = (typeof gallery.images)[number];

type GalleryItem =
  | { type: "image"; image: RawImage }
  | { type: "youtube"; image: RawImage; videoId: string }
  | { type: "carousel"; images: RawImage[]; coverImage: RawImage };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isYouTubeUrl(src: string) {
  return src.includes("youtube.com") || src.includes("youtu.be");
}

function getAspectRatio(orientation: string, isVideo = false): string {
  if (orientation === "vertical") return isVideo ? "9 / 16" : "3 / 4";
  if (orientation === "square") return "1 / 1";
  return "16 / 9";
}

// ─── Grouping pass ────────────────────────────────────────────────────────────
function buildGalleryItems(images: RawImage[]): GalleryItem[] {
  const items: GalleryItem[] = [];
  let i = 0;

  while (i < images.length) {
    const img = images[i];

    if (img.group) {
      const group = img.group;
      const groupImages: RawImage[] = [];
      while (i < images.length && images[i].group === group) {
        groupImages.push(images[i]);
        i++;
      }
      items.push({ type: "carousel", images: groupImages, coverImage: groupImages[0] });
      continue;
    }

    if (isYouTubeUrl(img.src)) {
      const videoId = extractYouTubeId(img.src);
      items.push({ type: "youtube", image: img, videoId });
    } else {
      items.push({ type: "image", image: img });
    }

    i++;
  }

  return items;
}

// ─── Hover wrapper ────────────────────────────────────────────────────────────
function HoverWrapper({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Flex
      fillWidth
      position="relative"
      radius="m"
      overflow="hidden"
      style={{
        cursor: onClick ? "pointer" : "default",
        transform: hovered ? "scale(1.025)" : "scale(1)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.35)" : "0 2px 8px rgba(0,0,0,0.12)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
      <Flex
        position="absolute"
        style={{
          inset: 0,
          background: "rgba(255,255,255,0.04)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s ease",
          pointerEvents: "none",
        }}
      />
    </Flex>
  );
}

// ─── YouTube cell ─────────────────────────────────────────────────────────────
function YouTubeCell({
  item,
  eager,
}: {
  item: Extract<GalleryItem, { type: "youtube" }>;
  eager?: boolean;
}) {
  return (
    <YouTubeFacade
      videoId={item.videoId}
      title={item.image.alt}
      aspectRatio={getAspectRatio(item.image.orientation, true)}
      eager={eager}
    />
  );
}

// ─── Single image cell — BUG 1 FIX ───────────────────────────────────────────
// We use our own Dialog instead of Media's `enlarge` prop.
// `enlarge` does an in-place CSS transform from the image's page position,
// which on mobile causes the "fly up" scroll-animation bug.
// Our Dialog opens as a fixed full-screen overlay with no scroll dependency.
function ImageCell({ item }: { item: Extract<GalleryItem, { type: "image" }> }) {
  const [open, setOpen] = useState(false);
  const aspectRatio = getAspectRatio(item.image.orientation);

  return (
    <>
      <HoverWrapper onClick={() => setOpen(true)}>
        <Media
          sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
          radius="m"
          aspectRatio={aspectRatio}
          src={item.image.src}
          alt={item.image.alt}
        />
      </HoverWrapper>

      {/* Lightbox — Media with its default `aspectRatio="original"` renders
          next/image with automatic height and zero cropping, so the image
          ALWAYS shows at its true natural aspect ratio regardless of the
          orientation tag assigned in content.tsx */}
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title={<span />}
        style={{ maxWidth: 900 }}
      >
        <Media
          src={item.image.src}
          alt={item.image.alt}
          sizes="(max-width: 900px) 100vw, 900px"
          radius="m"
        />
      </Dialog>
    </>
  );
}

// ─── Carousel cell — BUG 2 FIX ───────────────────────────────────────────────
function CarouselCell({ item }: { item: Extract<GalleryItem, { type: "carousel" }> }) {
  const [open, setOpen] = useState(false);
  const count = item.images.length;
  const aspectRatio = getAspectRatio(item.coverImage.orientation);

  const carouselItems = item.images.map((img) => ({
    slide: img.src,
    alt: img.alt,
  }));

  return (
    <>
      <HoverWrapper onClick={() => setOpen(true)}>
        {/* Cover thumbnail */}
        <Media
          sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
          radius="m"
          aspectRatio={aspectRatio}
          src={item.coverImage.src}
          alt={item.coverImage.alt}
        />

        {/* Badge — top-right corner */}
        <Flex
          position="absolute"
          style={{
            top: 10,
            right: 10,
            gap: 4,
            padding: "4px 8px",
            borderRadius: 20,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            alignItems: "center",
          }}
        >
          <Icon name="gallery" size="xs" onBackground="neutral-strong" />
          <Text
            variant="label-default-xs"
            onBackground="neutral-strong"
            style={{ color: "#fff", fontWeight: 600, letterSpacing: "0.02em" }}
          >
            1/{count}
          </Text>
        </Flex>
      </HoverWrapper>

      {/*
        BUG 2 FIX: Carousel aspect-ratio fix for mobile.
        - Dialog maxWidth capped at 640px (comfortable on any phone).
        - Carousel receives aspectRatio so it sizes itself correctly.
        - `sizes` hints Next.js to load the right resolution per breakpoint.
        - The Dialog's inner <section> already has overflowY:auto so tall
          carousels scroll naturally rather than overflowing the viewport.
      */}
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title={<span />}
        style={{
          maxWidth: 640,
          width: "100%",
        }}
      >
        <Carousel
          items={carouselItems}
          aspectRatio={aspectRatio}
          controls
          indicator="thumbnail"
          sizes="(max-width: 640px) 100vw, 640px"
        />
      </Dialog>
    </>
  );
}

// ─── Main gallery component ───────────────────────────────────────────────────
export default function GalleryView() {
  const items = buildGalleryItems(gallery.images);

  return (
    <MasonryGrid columns={3} m={{ columns: 2 }} s={{ columns: 1 }} gap="12">
      {items.map((item, index) => {
        if (item.type === "youtube")
          return (
            <Flex key={index} fillWidth style={{ breakInside: "avoid" }}>
              <YouTubeCell item={item} eager={index < 3} />
            </Flex>
          );

        if (item.type === "carousel")
          return (
            <Flex key={index} fillWidth style={{ breakInside: "avoid" }}>
              <CarouselCell item={item} />
            </Flex>
          );

        return (
          <Flex key={index} fillWidth style={{ breakInside: "avoid" }}>
            <ImageCell item={item} />
          </Flex>
        );
      })}
    </MasonryGrid>
  );
}
