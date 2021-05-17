<template>
	<view class="user">
		<view class='mineHeader' v-if="user">
			<navigator url='/pages/user/profile' class='headCont'>
				<view class='mimeImg'>
					<open-data type="userAvatarUrl"></open-data>
				</view>
				<view class='HeaderRight'>
					<text class='mineName'>{{user.nickname}}</text>
					<view class='mineNumber'>
						<text>{{user.phone | hide(3,8)}}</text>
					</view>
				</view>
			</navigator>
		</view>
		<view class="mineHeader" v-else>
			<view class="headCont">
				<view class='mimeImg'>
					<open-data type="userAvatarUrl"></open-data>
				</view>
				<view class='HeaderRight'>
					<view @click="login" class='login'>授权登录</view>
				</view>
			</view>
		</view>


		<view v-if="user" class='mineLink'>
			<navigator url='/pages/user/profile' class='Link-item'>
				<image src='/static/images/user/linkIcon1.png' class='LinkImg'></image>
				<text class='LinkText'>基本资料</text>
				<image src='/static/images/user/goLink.png' mode='widthFix' class='Arrow'></image>
			</navigator>
			<navigator url='/pages/user/profile' class='Link-item'>
				<image src='/static/images/user/linkIcon1.png' class='LinkImg'></image>
				<text class='LinkText'>支付密码修改</text>
				<image src='/static/images/user/goLink.png' mode='widthFix' class='Arrow'></image>
			</navigator>
			<navigator url='/pages/address/list' class='Link-item'>
				<image src='/static/images/user/linkIcon2.png' class='LinkImg'></image>
				<text class='LinkText'>我的收货地址</text>
				<image src='/static/images/user/goLink.png' mode='widthFix' class='Arrow'></image>
			</navigator>
			<navigator url='../myRating/myRating' class='Link-item'>
				<image src='/static/images/user/linkIcon3.png' class='LinkImg'></image>
				<text class='LinkText'>我的报修单</text>
				<image src='/static/images/user/goLink.png' mode='widthFix' class='Arrow'></image>
			</navigator>
			<navigator url='../myShare/myShare' class='Link-item'>
				<image src='/static/images/user/linkIcon4.png' class='LinkImg'></image>
				<text class='LinkText'>我的分享</text>
				<image src='/static/images/user/goLink.png' mode='widthFix' class='Arrow'></image>
			</navigator>
			<navigator url='../helpCenter/helpCenter' class='Link-item'>
				<image src='/static/images/user/linkIcon5.png' class='LinkImg'></image>
				<text class='LinkText'>清除缓存</text>
				<image src='/static/images/user/goLink.png' mode='widthFix' class='Arrow'></image>
			</navigator>
		</view>
		<view v-else class='mineLink'>
			<view @click="notice" class='Link-item'>
				<image src='/static/images/user/linkIcon1.png' class='LinkImg'></image>
				<text class='LinkText'>基本资料</text>
				<image src='/static/images/user/goLink.png' mode='widthFix' class='Arrow'></image>
			</view>
			<view @click="notice" class='Link-item'>
				<image src='/static/images/user/linkIcon1.png' class='LinkImg'></image>
				<text class='LinkText'>支付密码修改</text>
				<image src='/static/images/user/goLink.png' mode='widthFix' class='Arrow'></image>
			</view>
			<view @click="notice" class='Link-item'>
				<image src='/static/images/user/linkIcon2.png' class='LinkImg'></image>
				<text class='LinkText'>我的收货地址</text>
				<image src='/static/images/user/goLink.png' mode='widthFix' class='Arrow'></image>
			</view>
			<view @click="notice" class='Link-item'>
				<image src='/static/images/user/linkIcon3.png' class='LinkImg'></image>
				<text class='LinkText'>我的报修单</text>
				<image src='/static/images/user/goLink.png' mode='widthFix' class='Arrow'></image>
			</view>
			<view @click="notice" class='Link-item'>
				<image src='/static/images/user/linkIcon4.png' class='LinkImg'></image>
				<text class='LinkText'>我的分享</text>
				<image src='/static/images/user/goLink.png' mode='widthFix' class='Arrow'></image>
			</view>
			<view @click="notice" class='Link-item'>
				<image src='/static/images/user/linkIcon5.png' class='LinkImg'></image>
				<text class='LinkText'>清除缓存</text>
				<image src='/static/images/user/goLink.png' mode='widthFix' class='Arrow'></image>
			</view>
		</view>

		<u-toast ref="uToast" />

		<u-modal v-model="show" :content="content" :show-cancel-button="true" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
	export default {
		onShow()
		{
			//判断是否有登录
			var json = uni.getStorageSync('user')

			if(json)
			{
				//json字符串转化为对象
				var user = JSON.parse(json)

				//赋值data
				this.user = user
			}

		},
		data() {
			return {
				user:null,
				show:false,
				content:''
			}
		},
		methods:{
			login()
			{
				this.show = true
				this.content = '是否确认授权登录'
			},
			//授权登录
			confirm()
			{
				var that = this 

				this.show = false

				//登录获取临时凭证code
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
							code:res.code
						}


						//发送请求
						var result = await that.$u.proxy.user.login(data)

						if(result.code == 1)
						{
							that.user = result.data

							//转化为JSON 
							var json = JSON.stringify(result.data)

							//存储缓存中
							uni.setStorageSync('user',json)

						}else if(result.code == 2)
						{
							//授权成功，完善信息
							that.$refs.uToast.show({
								title: result.msg,
								type: 'success',
								url:'/pages/user/register'
							})
							return false
						}else
						{
							//提醒获取登录凭证失败
							that.$refs.uToast.show({
								title: result.msg,
								type: 'error',
							})
							return false
						}
					}
				})
			},
			//提醒信息
			notice()
			{
				this.$refs.uToast.show({
					title: '请先授权登录',
					type: 'error',
				})
				return false
			}
		},
		filters:{
			hide(phone, start, end)
			{
				var startpos = start
				var endpos = end
				var phonestr = phone

				//将字符串变成一个数组
				var phonearr = phonestr.split('')

				for(startpos;startpos<=endpos;startpos++)
				{
					phonearr[startpos] = '*'
				}

				//再将数组变成字符串
				return phonearr.join('')
			}
		},
	}
</script>

<style lang="scss">
	.mineHeader{height: 250rpx;background: linear-gradient(to bottom, #805e4e 0%, #362721 100%); position: relative;}
	.mineHeader .login{background: transparent;border:0px;color:#fff;margin-top:1.6em;font-size:1em;}
	.setUp{position: absolute; top:0; right: 30rpx;}
	.setUp image{width: 43rpx; height: 43rpx;}
	.headCont{position: absolute; left: 30rpx; bottom: 35rpx;overflow: hidden;}
	.mimeImg{
		width: 136rpx; 
		height: 136rpx;
		border-radius: 50%;  
		float: left;
		overflow:hidden;
	}
	.mimeImg image{width: 136rpx; height: 136rpx; }
	.HeaderRight{margin-left: 30rpx; float: left;}
	.mineName{font-size: 30rpx; color: #fff;  display: inline-block; margin-top: 30rpx;}
	.sexImg{width:22rpx; float: left; }
	.mineNumber{overflow: hidden;}
	.mineNumber image{display: inline-block; position: relative; top:27rpx;}
	.mineNumber text{display: inline-block; font-size: 26rpx; color: #fff;margin-top: 20rpx;}

	.meumList {border-bottom: 1px solid #e5e5e5;padding: 30rpx 27rpx; overflow: hidden; text-align: center; line-height: 35rpx;}
	.meumList-item{width: 30%;display: inline-block;}
	.line{width: 4rpx; height: 33rpx; background: #613a28; float: left; margin-top: 20rpx;}
	.num-name{margin-left: 25rpx;}
	.meumItemNum{font-size: 26rpx;color: #000; text-align: left;font-family: 'Impact'; font-weight: bold;}
	.meumItemName{font-size: 22rpx;color: #333333;}
	.menuCont{text-align: left; overflow: hidden; display: inline-block;}

	.stateBox{width: 100%; overflow: hidden; padding:30rpx 20rpx;}
	.stateList{width: 100%; line-height: 40rpx;}
	.stateList-item{width: 20%; text-align: center; display: inline-block; position: relative;}
	.stateList-item:first-child{border-right: 1px solid #ccc;}
	.stateList-item image{width: 57rpx; height: 57rpx;}
	.sateText{font-size: 22rpx; color: #333;}
	.number{position: absolute; right: 22rpx; top:-16rpx; background: #b66d4b; font-size: 22rpx; color: #fff; border-radius: 40rpx; padding:0rpx 14rpx;}

	.bannerImg{width: 100%; padding:0 27rpx;}
	.bannerImg image{width: 100%;}

	.mineLink{padding:30rpx 27rpx;}
	.Link-item{box-shadow: 0 1px 1px #f0f0f0; padding:0rpx 20rpx; height: 95rpx; line-height: 95rpx; position: relative;}
	.LinkImg{width: 41rpx; height: 50rpx;position: relative; top:12rpx;}
	.LinkText{font-size: 26rpx; color: #333; margin-left: 25rpx;}
	.Arrow{width: 15rpx; position: absolute; top:50%; right: 38rpx; transform: translateY(-50%);}

	.recommend{border-top: 1px solid #CCCCCC; padding:0 27rpx; padding-bottom: 25rpx;}
	.recommendTitle{font-size: 28rpx; color: #333333; margin-top:25rpx;}
	.recommendList{width: 100%; }
	.recommend-item{width: 200rpx; margin-right: 48rpx; display: inline-block; margin-top: 25rpx;}
	.recommend-item:nth-of-type(3n){margin-right: 0;}
	.recommend-item .recImg{width: 200rpx; height: 230rpx;}
	.recommendText{font-size: 22rpx; color: #333; line-height: 40rpx; height: 80rpx; overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;}
</style>
