/**
 * HTTP请求封装
 */

const install = (Vue, vm) => {

  //配置参数
	Vue.prototype.$u.http.setConfig({
		baseUrl: 'http://www.backend.com/wxapi', //本地地址
		// baseUrl: 'https://demo.k2006.com/wxapi', //线上地址
		showLoading: true, // 是否显示请求中的loading
		loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
		loadingText: '努力加载中~',
		loadingTime: 800, //超过多长时间显示loading
	})
	
	//请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		// 引用token
		// 方式一，存放在vuex的token，假设使用了uView封装的vuex方式
		// 见：https://uviewui.com/components/globalVariable.html
		// config.header.token = vm.token;
		
		// 方式二，如果没有使用uView封装的vuex方法，那么需要使用$store.state获取
		// config.header.token = vm.$store.state.token;
		
		// 方式三，如果token放在了globalData，通过getApp().globalData获取
		// config.header.token = getApp().globalData.username;
		
		// 方式四，如果token放在了Storage本地存储中，拦截是每次请求都执行的
		// 所以哪怕您重新登录修改了Storage，下一次的请求将会是最新值
		// const token = uni.getStorageSync('token');
		// config.header.token = token;
		// config.header.Token = 'xxxxxx';
		
		// 可以对某个url进行特别处理，此url参数为this.$u.get(url)中的url值
		// if(config.url == '/user/login') config.header.noToken = true;
		// 最后需要将config进行return
		// return config;
		// 如果return一个false值，则会取消本次请求
		// if(config.url == '/user/rest') return false; // 取消某次请求

		if(config.method.toUpperCase() == "POST")
		{
			//请求数据AES加密
			// config.data = vm.$u.aes.encrypt(config.data)
			config.data = config.data
		}
	}
	
	//响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		//AES解析
		// return vm.$u.aes.decrypt(res)
		return res
	}
}

export default {
	install
}