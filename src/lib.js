var magic = require('stream-mmmagic');
var request = require('request');
var types = require('./types.json');
var _ = require('lodash');

/**
 * Get the type of message based on contents
 * @param  {stream|string}   content  content to check
 * @param  {Function} callback Callback function
 */
exports.getMessageType = function (content, callback) {
  'use strict';
  var isAStream =
    typeof content.on === 'function' &&
    typeof content.read === 'function' &&
    typeof content.pipe === 'function';
  if (isAStream) {
    magic(content, function (err, mime) {
      if (err) {
        console.log(err);
      }
      if (_.contains(types.image, mime.type)) {
        callback('image');
      } else if (_.contains(types.audio, mime.type)) {
        callback('audio');
      } else if (_.contains(types.video, mime.type)) {
        callback('video');
      } else {
        callback('document');
      }
    });
  } else {
    callback('text');
  }
};

/**
 * Generic method to send HTTPS requests
 * @param  {Object}   params   form data
 * @param  {Function} callback Callback function
 */
exports.sendRequest = function (params, callback) {
  'use strict';
  request.post(params, function (err, res, body) {
    if (err) {
      console.error(err);
    }
    if (callback) {
      callback(JSON.parse(body));
    }
  });
};
