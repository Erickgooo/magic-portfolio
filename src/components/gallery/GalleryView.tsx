"use client";

import { Media, MasonryGrid, Flex } from "@once-ui-system/core";
import { gallery } from "@/resources";

export default function GalleryView() {
  return (
    <MasonryGrid columns={2} s={{ columns: 1 }}>
      {gallery.images.map((image, index) => {
        // 1. Detectamos si es video de YouTube
        const isYouTube = image.src.includes("youtube.com") || image.src.includes("youtu.be");

        // 2. Definimos la proporción exacta para cada caso
        let aspectRatio = "16 / 9"; // Por defecto horizontal

        if (image.orientation === "vertical") {
          // Si es VIDEO vertical -> 9/16 (Formato Reel/TikTok)
          // Si es FOTO vertical  -> 3/4 (Formato Retrato clásico)
          aspectRatio = isYouTube ? "9 / 16" : "3 / 4";
        }

        // CASO A: Es un Video de YouTube
        if (isYouTube) {
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
              style={{ aspectRatio: aspectRatio }}
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

        // CASO B: Es una Imagen normal
        return (
          <Media
            enlarge
            priority={index < 10}
            sizes="(max-width: 560px) 100vw, 50vw"
            key={index}
            radius="m"
            aspectRatio={aspectRatio}
            src={image.src}
            alt={image.alt}
          />
        );
      })}
    </MasonryGrid>
  );
}
