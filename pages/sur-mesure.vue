<template>
  <div>
    <HeroSection :image-src="page.heroImage">
      <template #title>
        {{ page.title }}
      </template>
    </HeroSection>
    <SectionContainer>
      <template #content>
        <EnrichedText :value="page.content" />
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
*[_type=="surMesure"][0]{
  ...
}
`
const { data: page } = await useSanityQuery(pageQuery, {}, {
  key: 'sur-mesure-page',
  getCachedData: (key) => {
    return useNuxtApp().payload.data[key] || useNuxtApp().static.data[key]
  },
})
console.log('page ', page.value)
</script>
