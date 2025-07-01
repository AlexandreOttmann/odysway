<template>
  <v-row
    justify="start"
    align="center"
  >
    <v-col cols="8.5">
      <v-card>
        <v-card-title
          class="text-primary text-wrap"
        >
          <a
            :href="link"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`Ouvrir le lien vers ${link}`"
          >
            <slot
              name="text"
            />
          </a>
        </v-card-title>
      </v-card>
    </v-col>
    <v-col cols="auto">
      <v-btn-secondary
        :href="link"
        :color="color"
        size="x-large"
        class="text-white"
        elevation="10"
        :aria-label="`Accéder à ${link}`"
        rel="noopener noreferrer"
      >
        <div class="text-white">
          <slot
            mdc-unwrap="p"
            name="cta"
          />
        </div>
        <template #prepend>
          <v-icon class="text-white">
            {{ mdiCursorDefaultClickOutline }}
          </v-icon>
        </template>
      </v-btn-secondary>
    </v-col>
  </v-row>
</template>

<script setup>
import { mdiCursorDefaultClickOutline } from '@mdi/js'

defineProps({
  link: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'primary',
  },
})
</script>
