'use strict';
var exec = require('child_process').exec;
var decamelize = require('decamelize');
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

function getCmd(opts) {
  var cmd = 'git describe';

  if (opts === true) {
    opts = {
      tags: true,
      abbrev: 0
    };
  } else {
    opts = opts || {};
  }

  _.forOwn(opts, function(val, opt) {
    opt = decamelize(opt, '-');
    if (opt === 'commitish' || opt === 'commit-ish') {
      cmd += ' ' + val;
    } else if (checkOptNeedsVal(opt)) {
      cmd += ' --' + opt + '=' + val;
    } else if (val) {
      cmd += ' --' + opt;
    }
  });

  return cmd;
}

function getLatestTag(opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  else {
    cb = cb || function() {};
  }

  var cmd = getCmd(opts);

  return exec(cmd, function(err, stdout) {
    if (err) {
      cb(err);
    } else {
      cb(null, String(stdout).trim());
    }
  }).stdout;
}

module.exports = getLatestTag;
