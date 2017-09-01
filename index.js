const path = require('path')

const ERRORS = {
  NO_MANIFEST_PROPERTY: 'no manifest property',
  FILE_NOT_FOUND: 'file not found'
}

module.exports = getDlls
module.exports.ERRORS = ERRORS

function getDlls (config) {
  const dlls = []
  let errors = []

  if (typeof config !== 'object') {
    throw new Error(`expecting config to be object, got "${typeof config}"`)
  }

  if (!Array.isArray(config.plugins)) {
    return {
      dlls: dlls,
      errors: null
    }
  }

  config.plugins.forEach((plugin, i) => {
    if (
      !plugin ||
      !plugin.constructor ||
      plugin.constructor.name !== 'DllReferencePlugin'
    ) {
      return
    }

    if (!plugin.options.manifest) {
      const thisErr = new Error()

      thisErr.stack = 'Error: ' + ERRORS.NO_MANIFEST_PROPERTY
      thisErr.type = ERRORS.NO_MANIFEST_PROPERTY
      thisErr.path = null
      thisErr.position = i

      errors.push(thisErr)

      return
    }

    let configPath = plugin.options.name
    let absPath = ''
    let config

    if (!plugin.options.name) {
      try {
        absPath = path.resolve(process.cwd(), plugin.options.manifest)
        configPath = require(absPath).name
      } catch (err) {
        const thisErr = new Error()

        thisErr.stack = 'Error: ' + ERRORS.FILE_NOT_FOUND
        thisErr.type = ERRORS.FILE_NOT_FOUND
        thisErr.path = absPath
        thisErr.position = i

        errors.push(thisErr)

        return
      }
    }

    absPath = path.resolve(configPath)

    try {
      config = require(absPath)
    } catch (err) {}

    if (!config) {
      const thisErr = new Error()

      thisErr.stack = 'Error: ' + ERRORS.FILE_NOT_FOUND
      thisErr.type = ERRORS.FILE_NOT_FOUND
      thisErr.path = absPath
      thisErr.position = i

      errors.push(thisErr)

      return
    }

    dlls.push({
      name: path.basename(absPath),
      config: config
    })
  })

  return {
    dlls: dlls,
    errors: errors.length ? errors : null
  }
}
