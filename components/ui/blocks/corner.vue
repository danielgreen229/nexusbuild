<template>
  <div :style="cornerStyles" class="corner__container"></div>
</template>

<script>
export default {
  name: 'Corner',
  props: ['rotation', 'left', 'top', 'mobileTop', 'mobileLeft'],
  computed: {
    cornerStyles () {
      const styles = {
        transform: `rotate(${this.rotation}deg)`,
        '--left': this.left || '',
        '--top': this.top || ''
      }

      if (this.mobileLeft !== null && this.mobileLeft !== undefined && this.mobileLeft !== '') {
        styles['--mobile-left'] = this.mobileLeft
      }
      if (this.mobileTop !== null && this.mobileTop !== undefined && this.mobileTop !== '') {
        styles['--mobile-top'] = this.mobileTop
      }

      return styles
    }
  }
}
</script>

<style scoped>
.corner__container {
  width: 2vw;
  height: 2vw;
  background: transparent;
  border-radius: 0;
  overflow: hidden;
  position: absolute;

  left: var(--left);
  top: var(--top);
}

.corner__container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 2vw;
  height: 2vw;
  background: radial-gradient(circle at bottom right, transparent 70%, #e8f0ff 71%);
}

@media (max-width: 1245px) {
  .corner__container {
    left: var(--mobile-left, var(--left));
    top: var(--mobile-top, var(--top));
  }
}
</style>
