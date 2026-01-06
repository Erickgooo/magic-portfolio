"use client";

import { Media, MasonryGrid, Flex } from "@once-ui-system/core";
import { gallery } from "@/resources";

export default function GalleryView() {
  return (
    <MasonryGrid columns={2} s={{ columns: 1 }}>
      {gallery.images.map((image, index) => {
        // Detectar si es un enlace de YouTube
        const isYouTube = image.src.includes("youtube.com") || image.src.includes("youtu.be");

        if (isYouTube) {
          // Extraer el ID del video para crear el enlace "embed"
          let videoId = "";
          if (image.src.includes("youtu.be")) {
            videoId = image.src.split("/").pop() || "";
          } else if (image.src.includes("v=")) {
            videoId = image.src.split("v=")[1].split("&")[0];
          }

          const embedUrl = `https://www.youtube.com/embed/${videoId}`;

          return (
            <Flex
              key={index}
              fillWidth
              position="relative"
              radius="m"
              overflow="hidden"
              background="surface"
              style={{
                aspectRatio: image.orientation === "horizontal" ? "16 / 9" : "3 / 4",
              }}
            >
              <iframe
                src={embedUrl}
                title={image.alt}
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Flex>
          );
        }

        // Si no es YouTube, muestra la imagen/video normal
        return (
          <Media
            enlarge
            priority={index < 10}
            sizes="(max-width: 560px) 100vw, 50vw"
            key={index}
            radius="m"
            aspectRatio={image.orientation === "horizontal" ? "16 / 9" : "3 / 4"}
            src={image.src}
            alt={image.alt}
          />
        );
      })}
    </MasonryGrid>
  );
}
