<template>
  <div :style="cornerStyles" class="corner__container"></div>
</template>

<script>
export default {
  name: 'Corner',
  props: ['rotation', 'left', 'top', 'mobileTop', 'mobileLeft'],
  computed: {
    // форматируем позиционные значения: если число -> rem, если содержит '%'|'rem'|'px' -> оставляем
    formatPos () {
      return (val) => {
        if (val === null || val === undefined || val === '') return ''
        if (typeof val === 'number') return val + 'rem'
        const s = String(val)
        // если уже содержит единицы или процент — возвращаем как есть
        if (s.includes('%') || s.includes('rem') || s.includes('px') || s.includes('vw') || s.includes('vh')) {
          return s
        }
        // иначе добавляем rem по умолчанию
        return s + 'rem'
      }
    },
    cornerStyles () {
      const styles = {
        transform: `rotate(${this.rotation}deg)`,
        // задаём CSS-переменные, которые используются в стилях компонента
        '--left': this.formatPos(this.left),
        '--top': this.formatPos(this.top)
      }

      // добавляем мобильные переменные только если они явно переданы (не null/undefined/'')
      if (this.mobileLeft !== null && this.mobileLeft !== undefined && this.mobileLeft !== '') {
        styles['--mobile-left'] = this.formatPos(this.mobileLeft)
      }
      if (this.mobileTop !== null && this.mobileTop !== undefined && this.mobileTop !== '') {
        styles['--mobile-top'] = this.formatPos(this.mobileTop)
      }

      return styles
    }
  }
}
</script>

<style scoped>
.corner__container {
  width: 2rem;
  height: 2rem;
  background: transparent;
  border-radius: 0;
  overflow: hidden;
  position: absolute;

  /* используем CSS-переменные, заданные в computed */
  left: var(--left);
  top: var(--top);
}

/* псевдоэлемент остаётся прежним */
.corner__container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 2rem;
  height: 2rem;
  background: radial-gradient(circle at bottom right, transparent 70%, white 71%);
}

/* медиазапрос: при ширине <= 1245px используем мобильные переменные, если они заданы.
   Если мобильная переменная не задана, var(...) вернёт запасную — обычную переменную. */
@media (max-width: 1245px) {
  .corner__container {
    left: var(--mobile-left, var(--left));
    top: var(--mobile-top, var(--top));
  }
}
</style>
