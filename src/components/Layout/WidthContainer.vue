<script setup lang="ts">
defineOptions({
  name: 'WidthContainer',
})
</script>

<template>
  <div class="width-container">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.width-container {
  max-width: 1180px;
  margin: 0 auto;
  // background-color: rgba(127, 255, 212, 0.247);
}
</style>
