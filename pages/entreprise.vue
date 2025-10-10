<template>
  <div>
    <HeroSection :image-src="page.heroSection.image">
      <template #title>
        {{ page.heroSection.title }}
      </template>
    </HeroSection>
    <SectionContainer>
      <template #content>
        <!-- TODO: create a wrapper in Sanity for these blocks and loop -->
        <EnrichedText :value="page.contentBlock1" />
        <CtaButton
          :external="page.ctaButton.external"
          :link="page.ctaButton.link"
          :text="page.ctaButton.text"
        />
        <EnrichedText :value="page.contentBlock2" />
        <CtaButton
          :external="page.ctaButton.external"
          :link="page.ctaButton.link"
          :text="page.ctaButton.text"
        />
        <EnrichedText :value="page.contentBlock3" />
        <CtaButton
          :external="page.ctaButton.external"
          :link="page.ctaButton.link"
          :text="page.ctaButton.text"
        />
        <EnrichedText :value="page.contentBlock4" />
        <EnrichedText :value="page.contentBlock5" />
        <CtaButton
          :external="page.ctaButton.external"
          :link="page.ctaButton.link"
          :text="page.ctaButton.text"
        />
      </template>
    </SectionContainer>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'simple-pages',
})

const pageQuery = `
*[_type == "entreprise"][0]{
  heroSection{
    ...,
  },
  contentBlock1[] {
    ...,
    _type == "image" => {
      "url": asset->url, // Fetches the image URL for Portable Text images
    },
  },
  contentBlock2[] {
    ...,
    _type == "image" => {
      "url": asset->url,
    },
  },
  contentBlock3[] {
    ...,
    _type == "image" => {
      "url": asset->url,
    },
  },
  contentBlock4[] {
    ...,
    _type == "image" => {
      "url": asset->url,
    },
  },
  contentBlock5[] {
    ...,
    _type == "image" => {
      "url": asset->url,
    },
  },
  ctaButton,
}
`
const { data: page } = await useSanityQuery(pageQuery, {}, {
  key: 'entreprise-page',
  getCachedData: (key) => {
    return useNuxtApp().payload.data[key] || useNuxtApp().static.data[key]
  },
})

console.log('page data ', page.value)
</script>
