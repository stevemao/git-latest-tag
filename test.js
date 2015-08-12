/*global it */
'use strict';
var assert	= require('assert');
var through	= require('through2');
var rewire	= require('rewire');

var gitLatestTagModule	= rewire('./');
var getCmd		= gitLatestTagModule.__get__('getCmd');
var gitLatestTag	= gitLatestTagModule.getLatestTag;
var gitLatestTagSync	= gitLatestTagModule.getLatestTagSync;

it('without options', function() {
  var cmd = getCmd();
  assert.strictEqual(cmd, 'git describe');
});

it('with an option that takes no value with a truthy value', function() {
  var cmd = getCmd({
    all: 'yes'
  });
  assert.strictEqual(cmd, 'git describe --all');
});

it('with an option that takes no value with a falsy value', function() {
  var cmd = getCmd({
    all: null
  });
  assert.strictEqual(cmd, 'git describe');
});

it('with an options that takes a value', function() {
  var cmd = getCmd({
    abbrev: 10
  });
  assert.strictEqual(cmd, 'git describe --abbrev=10');
});

it('with a "true"', function() {
  var cmd = getCmd(true);
  assert.strictEqual(cmd, 'git describe --tags --abbrev=0');
});

it('with an option "commit-ish"', function() {
  var cmd = getCmd({
    'commit-ish': 'HEAD'
  });
  assert.strictEqual(cmd, 'git describe HEAD');
});

it('with a camelCase option', function() {
  var cmd = getCmd({
    'exactMatch': true
  });
  assert.strictEqual(cmd, 'git describe --exact-match');
});

it('should return a readable stream', function(done) {
  gitLatestTag(true).pipe(through(function(chunk) {
    var tag = chunk.toString();
    assert.equal(tag.indexOf('v'), 0);
    done();
  }));
});

it('should callback with options', function(done) {
  gitLatestTag(true, function(err, tag) {
    assert.equal(tag.indexOf('v'), 0);
    done();
  });
});

it('should\'t work without options', function(done) {
  gitLatestTag(function(err, tag) {
      assert(err);
      return done();
  });
});

it('should work syncronously with true flag', function() {
  var tag = gitLatestTagSync(true);
  assert.equal(tag.indexOf('v'), 0);
});

it('should work syncronously with custom repo path', function() {
  var tag = gitLatestTagSync({abbrev: 0, tags: true, repoPath: "."});
  assert.equal(tag.indexOf('v'), 0);
});

it('shouldn\'t work syncronously with wrong custom repo path', function() {
  assert.throws(
    function() {
      var tag = gitLatestTagSync({abbrev: 0, tags: true, repoPath: "./somewhere"});
    },
    Error
  );
});
