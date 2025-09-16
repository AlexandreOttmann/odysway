<template>
  <div class="d-flex justify-center">
    <v-btn
      :color="color"
      height="62"
      size="large"
      @click="navigateTo('/prochains-departs?guaranted=true')"
    >
      <div class="text-white text-decoration-none text-body-1 font-weight-bold mx-4">
        <slot
          mdc-unwrap="p"
          name="text"
        />
      </div>
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'primary',
  },
  textColor: {
    type: String,
    default: 'white',
  },
})
</script>
