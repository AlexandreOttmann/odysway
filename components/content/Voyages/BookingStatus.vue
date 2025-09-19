<template>
  <v-row
    no-gutters
    align="center"
    class="ga-3 font-weight-bold"
  >
    <div>
      <CustomBadge :color="status.color" />
      {{ status.text }}
    </div>

    <div
      v-if="status.status !== 'pending' && bookedPlaces > 0"
      class="ml-1 d-flex align-center ga-2"
    >
      <v-icon
        size="20"
        color="primary"
        class="bg-grey-light rounded-circle"
      >
        {{ mdiAccountOutline }}
      </v-icon>
      {{ bookedPlaces }} inscrit{{ bookedPlaces > 1 ? 's' : '' }} <span>{{ textInterestedBy }}</span>
      <span
        v-if="status.status === 'confirmed'"
        class="font-weight-regular text-body-2"
      >
        - Reste {{ remainingPlaces }}
      </span>
    </div>
    <div
      v-else
      class="font-weight-regular"
    >
      (dès {{ minTravellers }} inscrits) <span class="font-weight-bold">{{ textInterestedBy }}</span>
    </div>
  </v-row>
</template>

<script setup>
import { mdiAccountOutline } from '@mdi/js'

const props = defineProps({
  status: {
    type: Object,
    required: true,
  },
  bookedPlaces: {
    type: Number,
    required: true,
  },
  nbInterestedBy: {
    type: Number,
    required: true,
  },
  maxTravellers: {
    type: Number,
    required: true,
  },
  minTravellers: {
    type: Number,
    default: 2,
  },
})

const remainingPlaces = computed(() => {
  const remaining = props.maxTravellers - props.bookedPlaces
  return remaining > 1 || remaining === 0 ? `${remaining} places` : `${remaining} place`
})

const textInterestedBy = computed(() => {
  if (props.nbInterestedBy >= 1) {
    const plural = props.nbInterestedBy > 1 ? 's' : ''
    return `- ${props.nbInterestedBy} intéressé${plural}`
  }
  return ''
})
console.log('interested by ', props.nbInterestedBy)
</script>
