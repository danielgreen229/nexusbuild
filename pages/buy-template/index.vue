<template>
	<div>
	</div>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

onMounted(async () => {
	console.log('zxc')
 	await navigateTo({ path: '/templates' })
})
</script>