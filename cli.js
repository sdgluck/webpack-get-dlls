#!/user/bin/env node
var configPath = './webpack.config.js'

if (process.argv[0] && process.argv[0].length > 2) {
  configPath = process.argv.slice(-1)[0]
}

try {
  var config = require(configPath)
  var res = require('./index.js')(config)
  res.dlls.forEach((dll) => console.log(dll.name))
} catch (err) {
  console.error('error:', err.message)
}
