<script setup lang="ts">
defineOptions({
  name: 'FooterComponent',
})
</script>

<template>
  <footer>
    <WidthContainer>
      <p>&copy; 2024 My Website</p>
    </WidthContainer>
  </footer>
</template>

<style scoped lang="scss">
footer {
  background-color: #333333;
  color: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}
</style>
