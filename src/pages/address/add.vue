<template>
	<view class="wrap">
		<u-form :model="address" ref="address">
			<view class="top">
				<view class="item">
					<view class="left">收货人</view>
					<u-form-item prop="consignee">
						<u-input type="text" v-model="address.consignee" placeholder-class="line" placeholder="请填写收货人姓名" />
					</u-form-item>
				</view>
				<view class="item">
					<view class="left">手机号码</view>
					<u-form-item prop="mobile">
						<u-input type="text" v-model="address.mobile" placeholder-class="line" placeholder="请填写收货人手机号" />
					</u-form-item>
				</view>
				<view class="item" @tap="showRegionPicker">
					<view class="left">所在地区</view>
					<u-form-item prop="regionText">
						<input disabled type="text" placeholder-class="line" placeholder="省市区县、乡镇等" v-model="address.regionText"  />
					</u-form-item>
				</view>
				<view class="item address">
					<view class="left">详细地址</view>
					<u-form-item prop="address">
						<textarea type="text" placeholder-class="line" placeholder="街道、楼牌等" v-model="address.address" />
					</u-form-item>
				</view>
			</view>
			<view class="bottom">
				<view class="default">
					<view class="left">
						<view class="set">设置默认地址</view>
					</view>
					<view class="right">
						<u-form-item prop="status">
							<switch color="red" @change="setDefault" />
						</u-form-item>
					</view>
				</view>
			</view>
			<u-button @click="add" type="success">提交</u-button>
		</u-form>

		<u-picker mode="region" @confirm="region" ref="uPicker" v-model="show" />

		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		onReady()
		{
			//在钩子里面去设置表单的验证规则
			this.$refs.address.setRules(this.rules)
		},
		onShow()
		{
			//判断是否有登录
			var user = this.$u.auth.check()

			if(JSON.stringify(user) == "{}")
			{
				//空对象
				this.$refs.uToast.show({
					title: '请先登录',
					type: 'error',
					back: true
				})
			}else
			{
				//将用户信息赋值
				this.user = user

				this.address.consignee = this.user.nickname
				this.address.mobile = this.user.phone
			}
		},
		data() {
			return {
				address:{
					consignee:'',
					address:'',
					mobile:'',
					regionText:'',
					region:0,
					status:false
				},
				user:null,
				show: false,
				rules: {
					consignee: [
						{
							required: true, 
							message: '请输入收件人', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change','blur'],
						}
					],
					mobile: [
						{
							required: true, 
							message: '请输入手机号码', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change','blur'],
						}
					],
					regionText: [
						{
							required: true, 
							message: '请选择地区', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change','blur'],
						}
					],
					address: [
						{
							required: true, 
							message: '请输入详细地址', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change','blur'],
						}
					],
				}
			}
		},
		methods: {
			setDefault(item) {
				this.address.status = item.detail.value
			},
			showRegionPicker() {
				this.show = true;
			},
			//选择收货地址
			region(item)
			{
				var province = item.province
				var city = item.city
				var district = item.area

				this.address.region = district.value

				//拼接显示文本内容
				this.address.regionText = `${province.label}-${city.label}-${district.label}`
			},
			add()
			{
				//表单验证
				var that = this


				this.$refs.address.validate(async valid => {
					if(!valid)
					{
						this.$refs.uToast.show({
							title: '表单验证失败',
							type: 'error',
						})

						return false
					}


					var address = that.address 
					address.userid = that.user.id

					//发送请求
					var result = await that.$u.proxy.user.addressadd(address)

					if(result.code == 1)
					{
						//成功
						that.$refs.uToast.show({
							title: result.msg,
							type: 'success',
							back: true
						})

						return false
					}else
					{
						//失败
						that.$refs.uToast.show({
							title: result.msg,
							type: 'error',
						})
						return false
					}



				})
			}
		}
	}
</script>


<style lang="scss" scoped>
/deep/ .line {
	color: $u-light-color;
	font-size: 28rpx;
}
.wrap {
	background-color: #f2f2f2;
	.top {
		background-color: #ffffff;
		border-top: solid 2rpx $u-border-color;
		padding: 22rpx;
		.item {
			display: flex;
			font-size: 32rpx;
			line-height: 100rpx;
			align-items: center;
			border-bottom: solid 2rpx $u-border-color;
			.left {
				width: 180rpx;
			}
			input {
				text-align: left;
			}
		}
		
		.address {
			padding: 20rpx 0;

			.left{
				flex-shrink:0;
				width:200rpx;
			}

			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
		}
		.site-clipboard {
			padding-right: 40rpx;
			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
			.clipboard {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26rpx;
				color: $u-tips-color;
				height: 80rpx;
				.icon {
					margin-top: 6rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
	.bottom {
		margin-top: 20rpx;
		padding: 40rpx;
		padding-right: 0;
		background-color: #ffffff;
		font-size: 28rpx;
		.tag {
			display: flex;
			.left {
				width: 160rpx;
			}
			.right {
				display: flex;
				flex-wrap: wrap;
				.tags {
					width: 140rpx;
					padding: 16rpx 8rpx;
					border: solid 2rpx $u-border-color;
					text-align: center;
					border-radius: 50rpx;
					margin: 0 10rpx 20rpx;
					display: flex;
					font-size: 28rpx;
					align-items: center;
					justify-content: center;
					color: $u-content-color;
					line-height: 1;
				}
				.plus {
					//padding: 10rpx 0;
				}
			}
		}
		.default {
			margin-top: 50rpx;
			display: flex;
			justify-content: space-between;
			border-bottom: solid 2rpx $u-border-color;
			line-height: 64rpx;
			.tips {
				font-size: 24rpx;
			}
			.right {
			}
		}
	}
}
</style>
