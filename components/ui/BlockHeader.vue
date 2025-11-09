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
  background: linear-gradient(135deg, #2575FC 0%, #6A11CB 85%);
  margin-top: -8rem;
  padding-top: 10rem;
}
</style>