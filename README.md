# webpack-get-dlls

> Get DLL configs from a webpack config

## Install

```bash
npm install webpack-get-dlls --save
```

Or, install globally for CLI:

```bash
npm install -g webpack-get-dlls
```

## API

### `getDlls(webpackConfig : Object) : Object`

Get all DLL configuration objects referenced in the given `webpackConfig`.

- __webpackConfig__ {Object} (required) The webpack configuration

Returns an object with `dlls` and `errs` properties, both arrays of objects.

For each DLL that could not be found a record will be in `errs`.

Error types are at `getDlls.ERRORS`. 

#### Example:

```js
const webpackConfig = require('./webpack.config.js')
const getDlls = require('webpack-get-dlls')

const {dlls, errs} = getDlls(webpackConfig)

if (errs.length) {
    console.log(errs)
    //=> [{
    //     error: 'DLL_NOT_FOUND',
    //     position: 0, // zero-indexed plugin position
    //     path: './vendor.webpack.config.js', // only present for DLL_NOT_FOUND
    //   }] 
}

console.log(dlls) 
//=> [{ 
//     name: 'dll.webpack.config.js',
//     config: ... // the DLL configuration object 
//   }]
```

## CLI

Outputs the name of each DLL on its own line.

Example:

```bash
$ webpack-get-dlls ./webpack.config.js
dll1.webpack.config.js
dll2.webpack.config.js
```

## Contributing

All pull requests and issues welcome!

If you're not sure how, check out the [great video tutorials on egghead.io](http://bit.ly/2aVzthz)!

## License

MIT © [Sam Gluck](github.com/sdgluck)
