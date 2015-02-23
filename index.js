'use strict';
var exec = require('child_process').exec;
var _ = require('lodash');

var optsNoVal = [
  'all',
  'tags',
  'contains',
  'exact-match',
  'debug',
  'long',
  'always',
  'first-parent'
];

function checkOptNeedsVal(opt) {
  if (_.contains(optsNoVal, opt)) {
    _.remove(optsNoVal, opt);

    return false;
  }

  return true;
}

function firstCommit(done) {
  exec('git log --format="%H" --pretty=oneline --reverse', function(err, stdout, stderr) {
    if (err) {
      done(err);
    }

    if (stderr || !String(stdout).trim()) {
      done(stderr);
    } else {
      // return empty string for first commit to appear in changelog
      done(null, '');
    }
  });
}

function getLatestTag(opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  else if (opts === true) {
    opts = {
      tags: true,
      checkFirstCommit: true,
      abbrev: 0
    };
  }
  else {
    opts = opts || {};
  }
  cb = cb || function() {};

  var cmd = 'git describe';
  _.forOwn(opts, function(val, opt) {
    if (opt === 'checkFirstCommit') {
      return;
    }
    if (checkOptNeedsVal(opt)) {
      cmd += ' --' + opt + '=' + val;
    }
    else if (val) {
      cmd += ' --' + opt;
    }
  });

  exec(cmd, function(err, stdout) {
    if (err) {
      if (opts.checkFirstCommit) {
        firstCommit(cb);
      } else {
        cb(err);
      }
    } else {
      cb(null, String(stdout).trim());
    }
  });

  return cmd;
}

module.exports = getLatestTag;
