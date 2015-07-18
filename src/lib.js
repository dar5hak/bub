/**
 * Copyright 2015 Darshak Parikh
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



var isStream = require('is-stream');
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
  if (isStream.readable(content)) {
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
  } else if (_.isString(content)) {
    callback('text');
  } else {
    console.error('Couldn\'t determine type of content. Please pass a string or a readable stream.');
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
    console.log(params, body);
    if (callback) {
      callback(JSON.parse(body));
    }
  });
};
