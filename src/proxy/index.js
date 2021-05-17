// 代理模块地址列表
import user from './user'
import repair from './repair'


const install = (Vue, vm) => {
	let modules = {
		user,
		repair
	}

	//循环组合接口API
	let api = {}
	for(let ModeName in modules) 
	{
		if(JSON.stringify(modules[ModeName]) == "{}")
		{
			continue
		}

		for(let ApiName in modules[ModeName]) 
		{
			let config = modules[ModeName][ApiName]
			config.name = ApiName
	
			if(!config.name || !config.url)
			{
				continue
			}

			if(!api[ModeName])
			{
				api[ModeName] = {}
			}

			switch(config.method.toUpperCase())
			{
				case "GET":
					api[ModeName][config.name] = (data = {}) => {
						return vm.$u.get(config.url,data)
					}
					break
				case "POST":
					api[ModeName][config.name] = (data = {}) => vm.$u.post(config.url,data)
					break
			}
		}
	}

	vm.$u.proxy = api
}

export default {
	install
}