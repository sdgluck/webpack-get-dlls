const path = require('path')

const getDlls = require('../')
const DllReferencePlugin = require('./DllReferencePlugin')

describe('webpack-get-dlls', () => {
  it('throws without config', () => {
    expect(() => getDlls()).toThrowError(/expecting config to be object/)
  })

  it('returns empty if config.plugins is not array', () => {
    expect(getDlls({plugins: null})).toEqual({
      dlls: [],
      errors: null
    })
  })

  it('gets DLL by manifest', () => {
    const config = {
      plugins: [
        new DllReferencePlugin({
          manifest: './test/manifest.json'
        })
      ]
    }

    const expected = {
      dlls: [
        {
          name: 'dll.webpack.config.js',
          config: {
            dll: true
          }
        }
      ],
      errors: null
    }

    expect(getDlls(config)).toEqual(expected)
  })

  it('gets DLL by name', () => {
    const config = {
      plugins: [
        new DllReferencePlugin({
          manifest: '_',
          name: './test/dll.webpack.config.js'
        })
      ]
    }

    const expected = {
      dlls: [
        {
          name: 'dll.webpack.config.js',
          config: {
            dll: true
          }
        }
      ],
      errors: null
    }

    expect(getDlls(config)).toEqual(expected)
  })

  it('produces NO_MANIFEST_PROPERTY error', () => {
    const config = {
      plugins: [
        new DllReferencePlugin({})
      ]
    }

    const result = getDlls(config)

    expect(result.dlls).toEqual([])
    expect(result.errors.length).toEqual(1)
    expect(result.errors[0].stack).toEqual('Error: ' + getDlls.ERRORS.NO_MANIFEST_PROPERTY)
    expect(result.errors[0].position).toEqual(0)
  })

  it('produces FILE_NOT_FOUND error', () => {
    const config = {
      plugins: [
        new DllReferencePlugin({
          manifest: '_',
          name: './dll.js'
        })
      ]
    }

    const result = getDlls(config)

    expect(result.dlls).toEqual([])
    expect(result.errors.length).toEqual(1)
    expect(result.errors[0].stack).toEqual('Error: ' + getDlls.ERRORS.FILE_NOT_FOUND)
    expect(result.errors[0].path).toEqual(path.resolve(process.cwd(), './dll.js'))
    expect(result.errors[0].position).toEqual(0)
  })
})
