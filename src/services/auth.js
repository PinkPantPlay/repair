/**
 * 自定义服务封装
 */

const install = (Vue, vm) => {

	//封装一个方法，用来转换缓存的数据 json 变成 js 对象
	let check = () => {

		//转换登录用户的数据方法
		var result = {}

		//判断是否有登录
		var json = uni.getStorageSync('user')

		if(json)
		{
			//json字符串转化为对象
			var user = JSON.parse(json)

			switch(user.gender)
			{
				case "1":
					user.genderText = "男"
					break
				case "2":
					user.genderText = "女"
					break
				default:
					user.genderText = "保密"
			}

			result = user
		}

		return result
	}

	//将封装好的方法导出外面使用
	vm.$u.auth = {check}
}

export default {
	install
}