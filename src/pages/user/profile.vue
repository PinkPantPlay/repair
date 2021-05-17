<template>
	<view class="user">
		<u-form class="profile" :model="user" ref="profile">
			<view class="thumb">
				<open-data type="userAvatarUrl"></open-data>
			</view>

			<u-form-item label="昵称" prop="nickname">
				<u-input v-model="user.nickname" />
			</u-form-item>

			<u-form-item label="性别" prop="genderText">
				<u-input type="select" :select-open="SexShow" v-model="user.genderText" placeholder="请选择性别" @click="SexShow = true" />
			</u-form-item>

			<u-form-item>
				<u-button @click="submit">提交</u-button>
			</u-form-item>
		</u-form>

		<!--性别列表-->
		<u-action-sheet :list="SexList" v-model="SexShow" @click="CheckSex"></u-action-sheet>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		onReady()
		{
			//在钩子里面去设置表单的验证规则
			this.$refs.profile.setRules(this.rules)
		},
		data() {
			return {
				user: this.$u.auth.check(),
				SexShow:false,
				SexList: [
					{
						text: '男',
						value:1
					},
					{
						text: '女',
						value:2
					},
					{
						text: '保密',
						value:0
					}
				],
				rules: {
					nickname: [
						{
							required: true, 
							message: '请输入昵称', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change','blur'],
						}
					],
					genderText: [
						{
							required: true, 
							message: '请选择性别', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change'],
						}
					]
				}
			}
		},
		methods:{
			//切换性别
			CheckSex(index)
			{
				this.user.gender = this.SexList[index].value
				this.user.genderText = this.SexList[index].text
			},
			async submit(wxuser)
			{
				var that = this
				this.$refs.profile.validate(async valid => {
					if(!valid)
					{
						this.$refs.uToast.show({
							title: '表单验证失败',
							type: 'error',
						})

						return false
					}

					//组装数据
					var data = {
						userid:that.user.id,
						nickname:that.user.nickname,
						gender:that.user.gender
					}
					
					//发起接口请求
					var result = await that.$u.proxy.user.profile(data)

					if(result.code == 1)
					{

						//要更新一下缓存信息
						//转化为JSON 
						var json = JSON.stringify(result.data)

						//存储缓存中
						uni.setStorageSync('user',json)

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

<style lang="scss">
	.user{
		padding-top:3em;
	}
	.thumb{
		text-align:center;
		font-size:1.5em;
		margin-bottom:1em;
		width:6em;
		height:6em;
		margin:0 auto;
		border-radius:50%;
		overflow:hidden;
		margin-bottom:2em;
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
