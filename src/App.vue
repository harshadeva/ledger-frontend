<script setup lang="ts">
import { RouterView } from 'vue-router'
import { reactive } from 'vue'

const theme = reactive({
  token: {
    colorPrimary: '#169288', // Match $primary-color from SCSS
    colorSecondary: '#50e3c2', // Match $secondary-color
    colorTertiary: '#6354e5', // Match $secondary-color
    marginParagraph: 0, // Reset paragraph margin,
  },
})
</script>

<template>
  <a-config-provider :theme="theme">
    <RouterView />
  </a-config-provider>
</template>
