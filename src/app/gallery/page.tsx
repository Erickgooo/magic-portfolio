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
          Cinematic video production used to require a crew, a budget, and days of shooting. These
          assets were built by one person, usually in hours.
        </Text>

        <Text variant="body-default-l" onBackground="neutral-weak">
          This section collects paid ad creatives, short-form video, and AI-generated content
          produced for real campaigns — each built around a specific platform context and commercial
          objective.
        </Text>

        <Text variant="body-default-l" onBackground="neutral-weak">
          <strong>Stack:</strong> Higgsfield · Kling 3.0 · Google Veo 3 · DaVinci Resolve · CapCut ·
          ElevenLabs · Affinity.
        </Text>
      </Column>

      <GalleryView />
    </Column>
  );
}
