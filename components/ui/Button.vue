<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: value => ['primary', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value)
  }
})
</script>

<template>
  <button :class="[
    'button',
    `button--${variant}`,
    `button--${size}`
  ]">
    <slot />
  </button>
</template>

<style scoped>
.button {
  display: inline-block;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;
}

.button--primary {
  background-color: var(--primary);
  color: var(--white);
}

.button--primary:hover {
  background-color: var(--primary-dark);
}

.button--outline {
  background-color: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
}

.button--outline:hover {
  background-color: var(--primary);
  color: var(--white);
}

.button--sm {
  padding: 8px 20px;
  font-size: 0.9rem;
}

.button--md {
  padding: 12px 28px;
}

.button--lg {
  padding: 14px 32px;
  font-size: 1.1rem;
}
</style>