<template>
  <v-container
    class="pt-4 py-md-0 my-0 px-2 px-md-4"
    fluid
  >
    <SimpleHeroSection :displayed-img="page.heroSection.image">
      <template #title>
        {{ page.heroSection.title }}
      </template>
    </SimpleHeroSection>
    <SectionContainer>
      <template #content>
        <EnrichedText :value="page.priseDeConscience.content" />
        <ConceptContainer :image-src="page.founderSection.imageUrl">
          <template #founder>
            {{ page.founderSection.caption }}
          </template>
        </ConceptContainer>
        <EnrichedText :value="page.ceQueOnDefend.content" />
        <EnrichedText :value="page.teamSection.content" />
      </template>
    </SectionContainer>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: 'simple-pages',
})

const pageQuery = `
*[_type == "visionVoyageOdysway"][0]{
  pageSettings{
    title,
    description,
    seo{
      title,
      description,
      robots,
    },
    sitemap{
      lastmod,
      videos,
      images,
    },
    ogImage{
      component,
      props{
        title,
        description,
        "imageUrl": image.asset->url,
      }
    },
    head{
      htmlAttrs{
        lang,
      },
      script,
    }
  },
  heroSection{
    ...,
  },
  priseDeConscience{
    content
  },
  founderSection{
    caption,
    "imageUrl": image.asset->url,
  },
  ceQueOnDefend{
    content
  },
  teamSection{
    content[]{
      ...,
      // Inline projection to dereference any image blocks within the Portable Text
      _type == "image" => {
        "url": asset->url,
        alt,
        caption,
      },
    }
  }
}
`
const { data: page } = await useSanityQuery(pageQuery, {}, {
  key: 'vision-voyage-odysway-page',
  getCachedData: (key) => {
    return useNuxtApp().payload.data[key] || useNuxtApp().static.data[key]
  },
})
console.log('page ', page.value)

// TODO:
// if (page.value) {
//   defineOgImageComponent(page.value?.ogImage?.component, {
//     title: page.value.ogImage?.props.title,
//     description: page.value.ogImage?.props.description,
//     image: page.value.ogImage?.props.image,
//   })

//   // Set the page title explicitly
//   useHead({
//     title: page.value.seo?.title || page.value.title,
//     htmlAttrs: {
//       lang: 'fr',
//     },
//     ...page.value.head,
//   })

//   // Set SEO meta tags
//   useSeoMeta({
//     title: page.value.seo?.title || page.value.title,
//     description: page.value.seo?.description || page.value.description,
//     ogTitle: page.value.seo?.title || page.value.title,
//     ogDescription: page.value.seo?.description || page.value.description,
//     ogType: 'website',
//     ogUrl: `https://odysway.com${route.path}`,
//     twitterTitle: page.value.seo?.title || page.value.title,
//     twitterDescription: page.value.seo?.description || page.value.description,
//     twitterCard: 'summary_large_image',
//     canonical: `https://odysway.com${route.path}`,
//     robots: page.value.robots || 'index, follow',
//   })
// }
</script>
