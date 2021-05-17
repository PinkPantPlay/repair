const files = require.context('.', false, /\.js$/)
const list = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  const item = files(key).default
  Object.assign(list, item)
})

export default list