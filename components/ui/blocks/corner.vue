<template>
	<div :style="cornerStyles" class="corner__container"></div>
</template>

<script>
export default {
	props: ['rotation', 'left', 'top'],
	computed: {
		cornerStyles () {
			let styles = {
				transform: 'rotate(' + this.rotation + 'deg)',
				left: this.left.includes('%')? this.left : this.left + 'rem',
				top: this.top.includes('%')? this.top : this.top + 'rem'
			}
			console.log(styles)
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
	left: -2rem;
	top: 0.74rem;
}

.corner__container::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 2rem;
	height: 2rem;
	background: radial-gradient(circle at bottom right, transparent 70%, white 71%);
}

</style>