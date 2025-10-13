<template>
  <div class="block-header__container">
    <slot/>
  </div>
</template>


<script setup>
</script>

<style scoped>
.block-header__container {
  text-align: center;
  padding: 80px 0;
  background: linear-gradient(135deg, #2563eb 0%, #7da5e6 68%, #2563eb 85%);
}
</style>