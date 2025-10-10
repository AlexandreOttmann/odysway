<template>
  <div>
    <PoliciesContainer>
      <template #title>
        {{ page.title }}
      </template>
      <template #text>
        <SectionContainer>
          <template #content>
            <EnrichedText
              :value="page.body"
            />
          </template>
        </SectionContainer>
      </template>
    </PoliciesContainer>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'simple-pages',
})

const route = useRoute()

const pageQuery = `
  *[_type == "privacyPolicy"][0] {
    title,
    body
  }
`
const { data: page } = await useSanityQuery(pageQuery, {
  slug: route.params.privacyPolicySlug,
}, {
  key: 'privacyPolicy-' + route.params.privacyPolicySlug,
  getCachedData: (key) => {
    return useNuxtApp().payload.data[key] || useNuxtApp().static.data[key]
  },
})
</script>
