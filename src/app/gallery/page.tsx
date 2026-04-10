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
          This section showcases visual assets created for real campaigns — spanning paid ad creatives, short-form video, and AI-generated content designed to perform across modern distribution channels.
        </Text>

        <Text variant="body-default-l" onBackground="neutral-weak">
          Each piece is built around a specific objective: capture attention in the first two seconds, communicate value without friction, and drive measurable action. Aesthetics serve strategy, not the other way around.
        </Text>

        <Text variant="body-default-l" onBackground="neutral-weak">
          My current creative stack combines traditional production tools with frontier AI video generation models — including Higgsfield, Kling 3.0, and Google Veo 3 — alongside Affinity, CapCut, DaVinci Resolve, and ElevenLabs for voice-over production. This combination allows me to produce high-impact visual content at a speed and quality level that wasn’t accessible outside major production studios until very recently.
        </Text>

        <Text variant="body-default-l" onBackground="neutral-weak">
          The result: campaign-ready assets that balance creative quality, platform relevance, and execution speed.
        </Text>
      </Column>

      <GalleryView />
    </Column>
  );
}
