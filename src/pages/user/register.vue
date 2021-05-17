<template>
	<view class="user">
		<form class='alertPassForm'>
			<view class="title">完善个人资料</view>
			<view class='item'>
				<input type="text" name='phone' v-model="user.phone" required placeholder='请输入手机号码' />
			</view>
			<view class='item'>
				<input type="password" name='paypass' v-model="user.paypass" required placeholder='请输入支付密码' />
			</view>
			<button form-type='submit' @getuserinfo='submit' open-type="getUserInfo" class='submitBtn'>提交</button>
		</form>

		<u-toast ref="uToast" />


	</view>
</template>

<script>
	export default {
		data() {
			return {
				user:{
					paypass:'',
					phone:''
				}
			}
		},
		methods:{
			submit(wxuser)
			{
				var that = this

				//获取表单内容
				var form = this.user

				 //手机号码验证
				let phoneReg = /^1[3-9]{1}[0-9]{9}$/

				if(!phoneReg.test(form.phone))
				{
					//提醒获取登录凭证失败
					that.$refs.uToast.show({
						title: '手机号码格式有误，请重新输入',
						type: 'error',
					})

					return false
				}

				//获取登录凭证
				uni.login({
					async success(res)
					{
						if(!res.code)
						{
							//提醒获取登录凭证失败
							that.$refs.uToast.show({
								title: '获取登录凭证失败',
								type: 'error',
							})
							return false
						}

						//组装数据
						var data = {
							phone:form.phone,
							paypass:form.paypass,
							code:res.code,
							nickname:wxuser.detail.userInfo.nickName,
							gender:wxuser.detail.userInfo.gender,
						}

						//发送接口请求
						var result = await that.$u.proxy.user.login(data)

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
							that.$refs.uToast.show({
								title: result.msg,
								type: 'error',
							})
							return false
						}


					}
				})

				return false
			}
		}
	}
</script>

<style lang="scss">
	.title{
		text-align:center;
		font-size:1.5em;
		margin-bottom:1em;
	}
	.alertPassForm{padding: 65rpx 70rpx; display: block;}
	.item{width: 100%; border: solid 1px rgba(204, 204, 204, 1); height: 100rpx; margin-top: 25rpx; border-radius: 10rpx; background: #fff;}
	.item{
		input{
			height:100%;
			line-height:100rpx;
			padding-left:1em;
		}
	}


	.eyeBox{width: 20%; height: 100%; display: inline-block; position: relative;}
	.eyeBox image{width: 44rpx; height: 27rpx; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);}
	.forgetPassBox{font-size: 28rpx; color: #cc9966; text-align: right; margin-top: 25rpx;}
	.forgetPassBox navigator{display: inline-block;}
	.tipText{font-size: 24rpx; color: #cc0000; line-height: 40rpx; margin-top: 20rpx;}
	.submitBtn{font-size: 32rpx; color: #fff; background: #704d3d; height: 90rpx; line-height: 90rpx; margin-top: 45rpx;}
	button::after{border: none;}

</style>
