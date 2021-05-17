<template>
  <view class="home">
    <u-form class="Container" :model="repair" ref="repair">
      <view class='goodBlock' @click="show = true">
        <u-form-item prop="typename">
          <image src='/static/images/repair/8_03.jpg' class='goodImg'></image>
          <view class='goodName'>{{repair.typename ? repair.typename : '选择商品类型'}}</view>
        </u-form-item>
      </view>

      <u-form-item prop="content">
        <view class='addRating'>
          <view class='areaTextBox'>
            <textarea v-model="repair.content" maxlength='-1' placeholder='请描述产品故障的具体原因' class='addRatingText'></textarea>
          </view>
        </view>
      </u-form-item>

      <u-form-item prop="phone">
        <view class='addRating'>
          <view class='areaTextBox phone'>
            <input v-model="repair.phone" type="text" placeholder="请输入手机号码" />
          </view>
        </view>
      </u-form-item>

      <view class='complaintReason'>
        <text>上传截图</text>
        <image src='/static/images/repair/filterHideIcon.png' class='arrow'></image>
      </view>

      <view class='complaintReason thumbs'>
        <!--<u-form-item prop="thumbs">
          <u-upload :action="action" max-count="9" :file-list="fileList" :auto-upload="false" ref="thumbs" name="thumbs" @on-uploaded="uploaded"></u-upload>
        </u-form-item>-->
        <u-form-item prop="gallery">
          <u-upload ref="gallery" name="gallery" :action="action" :auto-upload="false" :max-count="9" :limitType="limitType" :form-data="fileData" @on-uploaded="uploaded"></u-upload>
        </u-form-item>
      </view>

      <u-button class='btn' @click="submit">确定</u-button>
    </u-form>


    <u-select value-name="id" label-name="name" @confirm="select" v-model="show" :list="typelist"></u-select>

    <u-toast ref="uToast" />
  </view>
</template>

<script>
export default {
  onReady()
  {
    //在钩子里面去设置表单的验证规则
    this.$refs.repair.setRules(this.rules)
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
        isTab: true,
        duration:1000,
        url: '/pages/user/index'
      })
    }else
    {
      //将用户信息赋值
      this.user = user

      this.repair.phone = this.user.phone
      this.repair.userid = this.user.id

      //获取商品分类
      this.TypeData()
    }
  },
  data() {
    return {
      //上传图片的服务器地址
      action: 'http://www.backend.com/wxapi/repair/product/thumbs',
      fileList: [],
      user:{},
      show:false,
      typelist: [],
      limitType:['png', 'jpg', 'jpeg', 'webp', 'gif'],
      repair:{
        typeid:0,
        typename:'',
        phone:'',
        content:'',
        userid:0,
      },
      fileData:{},
      rules: {
        typename: [
          {
            required: true,
            message: '请选择商品分类',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['change','blur'],
          }
        ],
        content: [
          {
            required: true,
            message: '请输入报修内容',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['change','blur'],
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入报修人的手机号码',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['change','blur'],
          }
        ]
      }
    }
  },
  methods:{
    async TypeData()
    {
      //发送请求
      var result = await this.$u.proxy.repair.typelist()

      if(result.code == 1)
      {
        //获取分类成功
        this.typelist = result.data
      }else
      {
        //获取商品分类失败
        this.$refs.uToast.show({
          title: '暂无报修商品分类',
          type: 'error',
          back:true,
          duration:1000,
        })

        return false
      }
    },
    select(item)
    {
      this.show = false

      this.repair.typeid = item[0].value
      this.repair.typename = item[0].label
    },
    //文件上传
    uploaded(res)
    {
      this.$refs.uToast.show({
        title: '报修成功,请耐心等待厂家回复',
        type: 'success',
      })

      setTimeout(() => {
        this.$u.route({
          type: 'navigateTo',
          url:'/pages/repair/list'
        })
      },2000)
    },
    async submit()
    {
      var that = this

      this.$refs.repair.validate(async valid => {
        if(!valid)
        {
          this.$refs.uToast.show({
            title: '表单验证失败',
            type: 'error',
          })

          return false
        }

        //发送请求
        var result = await that.$u.proxy.repair.repairadd(that.repair)

        if(result.code == 1)
        {
          //报修成功  增加主键ID字段
          // that.fileData.repairid = result.data.repairid

          that.action = `http://www.backend.com/wxapi/repair/product/thumbs?repairid=${result.data.repairid}`

          //先判断图片的数量是否充足
          // that.$refs.thumbs.lists
          //有选择图片的
          if(that.$refs.gallery.lists.length > 0)
          {
            //上传图片
            that.$refs.gallery.upload()
          }else
          {
            //成功
            that.$refs.uToast.show({
              title: result.msg,
              type: 'success',
              url: '/pages/repair/list'
            })

            return false
          }

        }else
        {
          //报修失败
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
.Container{ overflow: hidden; display: block;}
.goodBlock{padding: 20rpx; overflow: hidden;}
.goodImg{width: 80rpx; height: 80rpx; float: left; }
.goodName{font-size: 26rpx; color: #666; float: left;  width: 570rpx; margin-left: 40rpx; line-height: 80rpx;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical; height: 80rpx;}

.complaintReason{font-size: 26rpx; color: #666; height: 95rpx; margin:20rpx; padding: 0 20rpx; line-height: 95rpx; border: 1px solid #CCCCCC; position: relative; }
.thumbs{height:auto;}
.arrow{position: absolute; width: 12rpx; height: 23rpx; top: 50%; transform: translateY(-50%); right: 40rpx;}

.addRating{border: 1px solid #CCCCCC; padding: 20rpx; margin: 0 20rpx; margin-top: 5rpx; overflow: hidden;}

.addRating .phone{height:50rpx;}
.areaTextBox{height: 175rpx;}
.addRatingText{font-size: 24rpx; line-height: 40rpx; color: #333; height: 175rpx; width: 100%; display: blobk;}
.upimgBox{margin-top: 10rpx; margin-bottom: 10rpx; }
.upimgBox image{width: 146rpx; height: 143rpx; margin-top: 20rpx; margin-right: 21rpx;}
.btn{width: 240rpx; height: 95rpx; background: #613a28; font-size: 28rpx; color: #fff; line-height: 95rpx; margin: auto; margin-top: 95rpx;}
button::after{border: none;}

.opcity{position: fixed; top: 0; bottom: 0; width: 100%; background: rgba(0,0,0,0.3);}
.cancelReasonBox{width: 85%; background: #fff; border-radius: 10rpx; position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 999;}
.reasonTitle{font-size: 34rpx; color: #000; font-weight: bold; text-align: center; line-height: 112rpx; border-bottom: 1px solid #ccc;}
.radio-item{width: 100%; display: inline-block; height: 90rpx; border-bottom: 1px solid #ccc; line-height: 90rpx; padding: 0 50rpx; font-size: 28rpx; color: #333; position: relative;}
.radio{position: absolute; right: 20rpx;}
.reasonConfirm{padding: 20rpx; overflow: hidden;}
.cancelCon{width: 160rpx; height: 80rpx; background: #e5e5e5; color: #333; font-size: 28rpx; border-radius: 10rpx; line-height: 80rpx; text-align: center; float: left; margin-left: 100rpx;}
.confirmCon{width: 160rpx; height: 80rpx; background: #613a28; color: #fff; font-size: 28rpx; border-radius: 10rpx; line-height: 80rpx; text-align: center; display: inline-block; margin-left: 80rpx;}
button::after{border:none;}
</style>
