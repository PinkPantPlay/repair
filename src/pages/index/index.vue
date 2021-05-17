<template>
	<view class="home">
		<view class="back">
			<u-swiper height="1110" :list="list" mode="none"></u-swiper>
		</view>

		<view class="module">
			<view class="box">
				<view class="item">报修指南</view>
				<view class="item">报修进度</view>
				<view class="item">
					<navigator url="/pages/product/list">
						商品大全
					</navigator>
				</view>
				<view class="item">
					<button open-type="contact">在线客服</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						image: '/static/images/home/1.jpeg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: '/static/images/home/2.jpeg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: '/static/images/home/3.jpeg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				],
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.home{
		width:100%;
		height:100%;
		position: relative;


		.back{
			width:100%;
			height:100%;
		}

		.module{
			position: absolute;
			left:0;
			top:0;
			width:100%;
			height:100%;
			display:flex;
			align-items:center;
			text-align:center;


			.box{
				width:90%;
				margin:0 auto;
				display:flex;
				align-items:center;
				text-align:center;
				flex-wrap:wrap;
				justify-content: space-between;

				.item{
					width:49%;
					height:7em;
					line-height:7em;
					text-align:center;
					font-size:1.2em;
					font-weight:bold;
					margin-bottom:.5em;
					color:#fff;

					button{
						background: transparent;
						color: #fff;
						width: 100%;
						height: 100%;
						line-height: 6.4em;
						display: block;
					}

					//item:nth-child(1)
					&:nth-child(1){
						background:rgba(255,193,37,.5);
					}

					&:nth-child(2){
						background:rgba(255,193,37,.5);
					}

					&:nth-child(3){
						background:rgba(255,193,37,.5);
					}

					&:nth-child(4){
						background:rgba(255,193,37,.5);
					}
				}
				
			}
		}


	}
</style>
