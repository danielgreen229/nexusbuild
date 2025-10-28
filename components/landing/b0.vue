<template>
	<bg class="b0__bg"/>
	<div class="b0__container">
		<div class="b0__block">
			<div class="b0__block-inside">
				<block_bg class="b0-block__bg"/>
			</div>
		</div>
	</div>
</template>

<script setup>
import bg from '~/assets/icons/landing/bg.svg'
import block_bg from '~/assets/icons/landing/block-bg.svg'
</script>

<style scoped>
.b0__bg {
	width: 100%;
	height: 100%;
	margin-bottom: 0;
}
.nuxt-icon--fill, .nuxt-icon--fill * {
	fill: revert-layer !important;
}
.b0__container {
	position: absolute;
	top: 0;
	width: 100%;
	height: 100%;
	padding: 20px;
}
.b0__block {
	max-width: 2100px;
	margin: 0 auto;
	background-color: white;
	padding: 12px 12px 96px 12px;
	border-radius: 26px;
  overflow: hidden;

}
.b0-block__bg {
	width: inherit;
	height: inherit;
	margin-bottom: 0;
}
.b0__block-inside {
	border-radius: 26px;
	overflow: hidden;
	background: linear-gradient(270deg, #6A11CB 0%, #2575FC 100%);
}
</style>

