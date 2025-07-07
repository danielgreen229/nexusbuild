<script setup>
import Hero from '@/components/sections/Hero.vue'
import Services from '@/components/sections/Services.vue'
import Promo from '@/components/sections/Promo.vue'
import Features from '@/components/sections/Features.vue'
import LeadForm from '@/components/sections/LeadForm.vue' 
</script>

<template>
  <div class="page">
    <main>
      <Hero />
      <Services />
      <Promo />
      <Features />
      <LeadForm /> 
    </main>
  </div>
</template>

<style>
/* Глобальные стили */
:root {
  --danger: #ef4444;
  --danger-light: #fee2e2;
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --secondary: #f97316;
  --dark: #1e293b;
  --gray: #64748b;
  --light-gray: #f1f5f9;
  --white: #ffffff;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --border: 1px solid #e2e8f0;
  --radius: 12px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  color: var(--dark);
  line-height: 1.5;
  background-color: var(--white);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section {
  padding: 80px 0;
}

.section--gray {
  background-color: var(--light-gray);
}

.section__title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 60px;
  position: relative;
}

.section__title::after {
  content: "";
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--primary);
  border-radius: 2px;
}

.text-accent {
  color: var(--secondary);
}
</style>