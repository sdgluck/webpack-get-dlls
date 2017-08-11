const path = require('path')

const ERRORS = {
  NO_MANIFEST_PROPERTY: 'NO_MANIFEST_PROPERTY',
  FILE_NOT_FOUND: 'FILE_NOT_FOUND'
}

module.exports = getDlls
module.exports.ERRORS = ERRORS

function getDlls (config) {
  const dlls = []
  let errors = null

  if (typeof config !== 'object') {
    throw new Error(`expecting config to be object, got "${typeof config}"`)
  } else if (!Array.isArray(config.plugins)) {
    return {dlls, errors}
  }

  config.plugins.forEach((plugin, i) => {
    if (!plugin.constructor || plugin.constructor.name !== 'DllReferencePlugin') {
      return
    }

    if (!plugin.options.manifest) {
      errors = errors || []
      errors.push({
        error: ERRORS.NO_MANIFEST_PROPERTY,
        position: i
      })
      return
    }

    let configPath = plugin.options.name
    let absPath

    if (!plugin.options.name) {
      try {
        absPath = path.resolve(process.cwd(), plugin.options.manifest)
        configPath = require(absPath).name
      } catch (err) {
        errors = errors || []
        errors.push({
          error: ERRORS.FILE_NOT_FOUND,
          path: absPath,
          position: i
        })
        return
      }
    }

    absPath = path.resolve(configPath)

    try {
      var config = require(absPath)
    } catch (err) {}

    if (!config) {
      errors = errors || []
      errors.push({
        error: ERRORS.FILE_NOT_FOUND,
        path: configPath,
        position: i
      })
      return
    }

    dlls.push({
      name: path.basename(absPath),
      config
    })
  })

  return {dlls, errors}
}
