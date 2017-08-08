// to test cli (done manually)

const DllReferencePlugin = require('./DllReferencePlugin')

module.exports = {
  plugins: [
    new DllReferencePlugin({
      manifest: './test/manifest.json'
    })
  ]
}
