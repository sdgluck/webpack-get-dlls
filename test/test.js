const getDlls = require('../')
const DllReferencePlugin = require('./DllReferencePlugin')

describe('webpack-get-dlls', () => {
  it('throws without config', () => {
    expect(() => getDlls()).toThrowError(/expecting config to be object/)
  })

  it('returns empty if config.plugins is not array', () => {
    expect(getDlls({plugins: null})).toEqual({
      dlls: [],
      errs: []
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
      errs: []
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
      errs: []
    }

    expect(getDlls(config)).toEqual(expected)
  })

  it('produces NO_MANIFEST_PROPERTY error', () => {
    const config = {
      plugins: [
        new DllReferencePlugin({})
      ]
    }

    expect(getDlls(config)).toEqual({
      dlls: [],
      errs: [{
        error: getDlls.ERRORS.NO_MANIFEST_PROPERTY,
        position: 0
      }]
    })
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

    expect(getDlls(config)).toEqual({
      dlls: [],
      errs: [{
        error: getDlls.ERRORS.FILE_NOT_FOUND,
        path: './dll.js',
        position: 0
      }]
    })
  })
})
