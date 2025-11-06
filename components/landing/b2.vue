<template>
	<div class="b2">
		<div class="b2__top">
			<h2 class="b2__top-h2">
				<span>Почему мы</span>
			</h2>
		</div>
		<div class="b2__main">
			<h2 class="b2__main-h2">
				Почему выбирают нас
			</h2>

			<div class="b2__info">
				<div class="b2__container">
					<div class="b2__item">
						<img alt="sitebypro-master" class="b2__master-img" src="@/assets/images/landing/b2-master.png"/>
						<div class="b2__item-first-container">
							<h3 class="b2__item-first-h3">5 лет на рынке</h3>
							<p class="b2__item-first-p">В&nbsp;веб-разработке, знаем как превратить идею в&nbsp;доход</p>
						</div>
					</div>
					<div class="b2__item">
						<div class="b2__item-second-container">
							<h3 class="b2__item-second-h3">100%</h3>
							<p class="b2__item-second-p">довольных клиентов</p>
						</div>
						<p class="b2__item-second-about-p">большинство клиентов приходят повторно или рекомендуют нас партнёрам</p>
					</div>
					<div class="b2__item">
						<div class="b2__item-third-bussiness">
							<img alt="sitebypro-circle" class="b2__circle" src="@/assets/images/landing/b2-circle.png">
							<div class="b2__item-third-info-b">
								<h3 class="b2__item-third-bussiness-h3">Бизнес-подход</h3>
								<p class="b2__item-third-bussiness-p">сайты под KPI бизнеса</p>
							</div>
						</div>
						<div class="b2__item-third-kpi">
							<img alt="sitebypro-kpi" class="b2__kpi" src="@/assets/images/landing/b2-kpi.png">
							<div class="b2__item-third-info-k">
								<h3 class="b2__item-third-kpi-h3">Поддержка после запуска</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>

</script>

<style>
.b2 {
  /*min-height: calc(97vh + 5px);*/
  position: relative;
  height: 100%;
}

.b2__top-h2 {
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

.b2__main-h2 {
	font-size: 4vw;
	position: relative;
	font-weight: 400;
	line-height: 100%;
	letter-spacing: -0.06em;
	padding: 4vw 7vw;
}
.b2__main-h2-colored {
	color: #0040C1;
}
.b2__main {
	position: relative;
	padding: 1vw 1vw 12vw 1vw;
	background: linear-gradient(0deg, #4a72ef -75%, #e7f0ff 75%)
}

.b2__info {
	padding: 0 4vw;
}
.b2__container {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	gap: 2vw;
}
.b2__item {
	width: 35%;
}

.b2__item:nth-child(1) {
	background-color: white;
	padding: 1.5vw;
	border-radius: 2vw;
}

.b2__master-img {
	width: 100%;
	height: auto;
}

.b2__item-first-container {
	padding: 1vw 1vw 0.5vw 1vw;
}

.b2__item-first-h3 {
	font-weight: 500;
	font-size: 3vw;
	line-height: normal;
	color: #0040c1;	
}

.b2__item-first-p {
	font-weight: 400;
	font-size: 1.5vw;
	margin-top: 1vw;
	color: #4e4e4e;
	line-height: normal;
}

.b2__item:nth-child(2) {
	background: linear-gradient(134deg, #1c4eff -100%, #bfa1ff 100%);
	border-radius: 2vw;
	padding: 2vw;
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	align-items: flex-start;
	width: 25%;
}

.b2__item-second-h3 {
	font-weight: 500;
	font-size: 3vw;
	line-height: normal;
	color: white;	
}
.b2__item-second-p {
	font-weight: 400;
	font-size: 1.5vw;
	color: #fff;
	margin-top: 0.5vw;
	line-height: normal;
}

.b2__item-second-about-p {
	font-weight: 300;
	font-size: 1.4vw;
	line-height: 133%;
	color: #fff;
	margin-top: auto;
}

.b2__item:nth-child(3) {
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	gap: 2vw;	
}

.b2__circle {
	width: 100%;
	object-fit: cover;
	height: 100%;
	position: absolute;
  left: 0;
  top: 0;
}

.b2__item-third-bussiness {
	height: 50%;
	border-radius: 2vw;
	overflow: hidden;
	position: relative;
}
.b2__item-third-kpi {
	width: 100%;
	height: 50%;
	border-radius: 2vw;
	overflow: hidden;
	position: relative;
}

.b2__kpi {
	width: 100%;
	height: 100%;
	position: absolute;
  left: 0;
  top: 0;
}

.b2__item-third-info-b {
	z-index: 2;
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: flex-end;
	padding: 2vw;
}

.b2__item-third-info-k {
	z-index: 2;
	position: relative;
	padding: 2vw;
}

.b2__item-third-bussiness-h3 {
	font-weight: 400;
	color: #0040c1;
	font-size: 3vw;
	line-height: normal;
}

.b2__item-third-bussiness-p {
	font-weight: 400;
	font-size: 1.5vw;
	color: #4e4e4e;
	line-height: normal;
	margin-top: 1vw;
}


.b2__item-third-kpi-h3 {
	font-weight: 400;
	color: white;
	font-size: 3vw;
	line-height: normal;
}

@media (max-width: 768px) {
	.b2 {
		padding-top: 0vw;
		background-color: white;
	}
	.b2__top-h2 {
		transform: translateY(-12vw);
		font-size: 7vw;
		font-weight: 400;
		padding: 1vw 9vw;
		background-color: white;
	}
	.b2__main {
		padding: 3vw 3vw 30vw 3vw;
		background: white;
	}
	.b2__main-h2 {
		font-weight: 400;
		font-size: 12vw;
		letter-spacing: -0.9vw;
		padding-top: 12vw;
		padding-bottom: 9vw;
	}
	.b2__container {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		gap: 5vw;
	}
	.b2__item:nth-child(3) {
		gap: 5vw;
	}
	.b2__item, .b2__item:nth-child(2) {
		width: 100%;
	}
	.b2__item:nth-child(2), .b2__item-third-bussiness, .b2__item-third-kpi {
		padding: 5vw;
		border-radius: 6vw;
	}
	.b2__item:nth-child(1) {
		background: #e9f0ff;
		padding: 5vw;
		border-radius: 6vw;
	}

	.b2__item-first-h3, .b2__item-second-h3, .b2__item-third-bussiness-h3, .b2__item-third-kpi-h3 {
		font-size: 11vw;
    font-weight: 400;
	}  

	.b2__item-first-p, .b2__item-second-p, .b2__item-second-about-p, .b2__item-third-bussiness-p {
		font-size: 7vw;
		margin-top: 3vw;
		font-weight: 300;
	}     
	.b2__item-second-p {
		font-weight: 400;
	}
	.b2__item-second-about-p {
		margin-top: 16vw;
		font-size: 6vw;
	} 

}
</style>