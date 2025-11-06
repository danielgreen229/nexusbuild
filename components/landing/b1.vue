<template>
	<div class="b1">
		<div class="b1__container">
			<bg class="b1__bg"/>
		</div>
		<div class="b1__top">
			<h2 class="b1__top-h2">
				<!--<Corner
				  :rotation="180"
				  left="-2vw"
				  top="3vw"
				/>-->
				<span>Наши услуги</span>
				<!--<Corner
				  :rotation="-90"
				  left="20.6vw"
				  top="3vw"
				/>-->
			</h2>
		</div>


		<div class="b1__main">
			<h2 class="b1__main-h2">
				<span class="b1__main-h2-colored">Полный цикл разработки сайтов</span>
				<br>
				от идеи до запуска и поддержки.
			</h2>
			<div class="b1__list">
				<div class="b1__list-item">
					<div class="b1__item-bg"/>
					<item-share/>
					<itemCorner class="b1__item-corner"/>
					<div class="b1__item-container">
						<div class="b1__item-info">
							<h3 class="b1__item-h3">Лендинг</h3>
							<p class="b1__item-p">Одностраничный сайт для запуска продукта, акции или сбора лидов. С фокусом на конверсию и быстрой отдаче.</p>
						</div>
						<div class="b1__item-checkbox">
							<p class="b1__p-checkbox">
								<itemCheckbox class="b1__p-checkbox-img"/>
								<span>UX-структура и продающий текст</span>
							</p>
							<p class="b1__p-checkbox">
								<itemCheckbox class="b1__p-checkbox-img"/>
								<span>адаптивная верстка mobile / desktop</span>
							</p>
							<p class="b1__p-checkbox">
								<itemCheckbox class="b1__p-checkbox-img"/>
								<span>форма заявки + интеграция с e-mail</span>
							</p>
						</div>
						<div class="b1__item-bottom">
							<p class="b1__item-price-p">30 000₽</p>
							<button class="b1__item-button">Заказать</button>
						</div>
					</div>
				</div>
				<div class="b1__list-item">
					<div class="b1__item-bg"/>
					<itemCorner class="b1__item-corner"/>
					<div class="b1__item-container">
						<div class="b1__item-info">
							<h3 class="b1__item-h3">Корпоративный сайт</h3>
							<p class="b1__item-p">Многостраничный сайт для бренда или компании: услуги, команда, кейсы, блог и контакты. Сделаем так, чтобы клиент сразу понял ценность.</p>
						</div>
						<div class="b1__item-checkbox">
							<p class="b1__p-checkbox">
								<itemCheckbox class="b1__p-checkbox-img"/>
								<span>прототипы ключевых страниц</span>
							</p>
							<p class="b1__p-checkbox">
								<itemCheckbox class="b1__p-checkbox-img"/>
								<span>адаптивный дизайн</span>
							</p>
							<p class="b1__p-checkbox">
								<itemCheckbox class="b1__p-checkbox-img"/>
								<span>CMS редактирование контента + обучение</span>
							</p>
						</div>
						<div class="b1__item-bottom">
							<p class="b1__item-price-p">80 000₽</p>
							<button class="b1__item-button">Заказать</button>
						</div>
					</div>
				</div>
				<div class="b1__list-item">
					<div class="b1__item-bg"/>
					<itemCorner class="b1__item-corner"/>
					<div class="b1__item-container">
						<div class="b1__item-info">
							<h3 class="b1__item-h3">Bеб-магазин</h3>
							<p class="b1__item-p">Каталог, корзина, оплата, учёт товаров и интеграции с доставкой, всё для старта продаж.</p>
						</div>
						<div class="b1__item-checkbox">
							<p class="b1__p-checkbox">
								<itemCheckbox class="b1__p-checkbox-img"/>
								<span>карточки товара и фильтры</span>
							</p>
							<p class="b1__p-checkbox">
								<itemCheckbox class="b1__p-checkbox-img"/>
								<span>корзина, оформление заказа</span>
							</p>
							<p class="b1__p-checkbox">
								<itemCheckbox class="b1__p-checkbox-img"/>
								<span>интеграция с платёжной системой</span>
							</p>
							<p class="b1__p-checkbox">
								<itemCheckbox class="b1__p-checkbox-img"/>
								<span>настройка логистики и выгрузок</span>
							</p>
						</div>
						<div class="b1__item-bottom">
							<p class="b1__item-price-p">30 000₽</p>
							<button class="b1__item-button">Заказать</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import bg from '~/assets/images/landing/b1-background.svg';
import Corner from '~/components/ui/blocks/corner.vue';

import itemCorner from '~/assets/images/landing/item-share.svg';

import itemCheckbox from '~/assets/images/landing/checkbox.svg';

</script>


<style scoped>
.b1 {
  min-height: calc(118vh + 5px);
  position: relative;
  height: 100%;
}
.b1__bg {
  height: 94vw;
  width: 100%;
  position: absolute;
}
.nuxt-icon--fill, .nuxt-icon--fill * {
	fill: revert-layer !important;
}
.b1 {
	min-height: calc(118vh + 5px);
}
.b1__top-h2 {
	position: absolute;
	left: 12vw;
	font-size: 2.5vw;
	color: #0040C1;
	transform: translateY(-5vw);
	padding: 1vw 3vw;
	background-color: #e8f0ff;
	border-radius: 2vw 2vw 0 0;
	font-weight: normal;
}
.b1__main-h2 {
	font-size: 4vw;
	font-weight: 500;
	line-height: 100%;
	letter-spacing: -0.06em;
	padding: 4vw 5vw;
	position: absolute;
}
.b1__main-h2-colored {
	color: #0040C1;
}
.b1__main {
	position: relative;
	padding: 1vw;
}

.b1__list {
	display: flex;
	gap: 6.4vw;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: flex-start;
	padding: 0 4vw;
}
.b1__list-item >  * {
	z-index: 1;
	position: relative;
}
.b1__item-container {
	padding: 2vw 1.5vw 2vw 1.5vw;
	cursor: pointer;
}

.b1__list-item {
	width: 33.33%;
	position: relative;
	border-radius: 2vw;
	overflow: hidden;
}
.b1__item-corner {
	width: 8vw;
	height: 8vw;
  position: absolute;
  right: 0vw;
  top: 0;
}
.b1__p-checkbox-img {
  width: 2vw;
  height: 2vw;
}
.b1__p-checkbox {
	display: flex;
	gap: 0.8vw;
	align-items: center;
	flex-direction: row;
	flex-wrap: nowrap;
	font-weight: 500;
	font-size: 1.5vw;
	color: #4e4e4e;
}

.b1__item-bg {
	background-color: white;
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 0;
	clip-path: polygon(80% 0, 80% 17%, 100% 17%, 100% 100%, 0 100%, 0 0);
}

.b1__list-item:nth-child(1) {
	margin-top: 20vw;
}
.b1__list-item:nth-child(2) {
	margin-top: 24.5vw;
}
.b1__list-item:nth-child(3) {
	margin-top: 5vw;
}
.b1__item-h3 {
	font-weight: 500;
	font-size: 2.5vw;
	color: #0040c1;
	line-height: normal;
}

.b1__item-p {
	font-weight: 400;
	font-size: 2vw;
	line-height: 130%;
	color: #687a8e;
	line-height: normal;
	margin-top: 1vw;
}

.b1__item-checkbox {
	margin-top: 2vw;
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	gap: 1vw;
}


.b1__item-bottom {
	margin-top: 3vw;
	display: flex;
	align-items: center;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-between;
}
.b1__item-price-p {
	font-weight: 600;
	font-size: 3vw;
	background: linear-gradient(45deg, #0017e4 0%, #3793ff 100%);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.b1__item-button {
	background: linear-gradient(133deg, #1c4eff 0%, #bfa1ff 100%);
	border-radius: 5vw;
	padding: 1vw 3.5vw;
	font-weight: 600;
	font-size: 1.5vw;
	letter-spacing: -0.03em;
	text-align: center;
	color: #fff;
	border: none;
	outline: none;
	cursor: pointer;
}

.b1__container {
	min-height: calc(118vh + 5px);
	position: absolute;
	height: 100%;
	width: 100%;
	overflow: hidden;
}
</style>





