#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Coverage Status][coverall-url]][coverall-image]

> Get the most recent git tag of your repository using git-describe(1)


## Install

```sh
$ npm install --save git-latest-tag
```


## Usage

### Use a callback

```js
var getLatestTag = require('git-latest-tag');
var options = {
  all: 'ok',
  contains: true,
  candidates: 10,
  'commit-ish': 'HEAD'
};

getLatestTag(options, function(err, tag) {
  console.log(tag);
  //=> latestTag
});
```

### Use as a readable stream

```js
var getLatestTag = require('git-latest-tag');
var options = {
  all: 'ok',
  contains: true,
  candidates: 10,
  'commit-ish': 'HEAD'
};

getLatestTag(options)
  .pipe(...);
```


## API

### getLatestTag([options], [callback])

Returns a readable stream.

#### options

Type: `object` or `boolean`

All options will be dash-cased for you.

Please check the available options at http://git-scm.com/docs/git-describe.

*NOTE*: if a flag takes no value and the passed `options.value` is truthy, it will generate the flag only without any value. If it's falsy the flag will not be included.

If it's a `true`, it will suppress long format, only showing the closest tag in refs/tags namespace and will return an empty string if there is no tags but more than one commit (same as `{ tags: true, abbrev: 0 }`).

#### callback(err, tag)


## License

MIT © [Steve Mao](https://github.com/stevemao)


[npm-url]: https://npmjs.org/package/git-latest-tag
[npm-image]: https://badge.fury.io/js/git-latest-tag.svg
[travis-url]: https://travis-ci.org/stevemao/git-latest-tag
[travis-image]: https://travis-ci.org/stevemao/git-latest-tag.svg?branch=master
[daviddm-url]: https://david-dm.org/stevemao/git-latest-tag.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/stevemao/git-latest-tag
[coverall-url]: https://coveralls.io/r/stevemao/git-latest-tag
[coverall-image]: https://coveralls.io/repos/stevemao/git-latest-tag/badge.svg
