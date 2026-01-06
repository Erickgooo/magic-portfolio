import { Column, Heading, Text, Meta, Schema } from "@once-ui-system/core";
import GalleryView from "@/components/gallery/GalleryView";
import { baseURL, gallery, person } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: gallery.title,
    description: gallery.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(gallery.title)}`,
    path: gallery.path,
  });
}

export default function Gallery() {
  return (
    <Column maxWidth="l" fillWidth gap="xl">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={gallery.title}
        description={gallery.description}
        path={gallery.path}
        image={`/api/og/generate?title=${encodeURIComponent(gallery.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${gallery.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      
      {/* Sección de Texto Introductorio */}
      <Column fillWidth gap="m" paddingX="l">
        <Heading variant="display-strong-s" marginBottom="m">
          {gallery.title}
        </Heading>
        
        <Text variant="body-default-l" onBackground="neutral-weak">
          This section showcases a curated selection of visual assets I’ve created for digital advertising and social media performance.
        </Text>
        
        <Text variant="body-default-l" onBackground="neutral-weak">
          The focus goes beyond aesthetics — each piece is designed to capture attention quickly, communicate value clearly, and support specific marketing objectives.
          My work includes short-form video, paid ad creatives, and graphic content developed for real campaigns and distribution channels.
        </Text>
        
        <Text variant="body-default-l" onBackground="neutral-weak">
          To produce these assets, I leverage a mix of professional design, video, and AI-powered tools, including Affinity, CapCut, DaVinci Resolve, ElevenLabs for voice-over production, and TikTok Symphony Creative Studio for AI-assisted creative development.
        </Text>
        
        <Text variant="body-default-l" onBackground="neutral-weak">
          Every piece shown here reflects a balance between creativity, speed, and performance — optimized for modern platforms where clarity, motion, and relevance drive results.
        </Text>
      </Column>

      <GalleryView />
    </Column>
  );
}
