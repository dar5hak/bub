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



require('sugar');
var async = require('async');
var lib = require('./lib');
var util = require('util');

// Constructor for the whole darn thing
var Bub = function (config) {
  'use strict';
  var BASE_URL = 'https://api.telegram.org/bot' + config.token;
  var TIMEOUT = config.timeout || 864000;
  var offset = null;

  // A reference to `this`, required for emitting events
  var self = this;

  function handleUpdates(body) {
    body.result.forEach(function (result) {
      // Convenience method for quick responses
      result.respond = function (content) {
        if (content.isString) {
          self.sendMessage({
            chat_id: result.message.chat.id,
            text: content
          });
          return;
        }
        async.parallel([
          function (callback) {
            var message = {
              chat_id: result.message.chat.id,
              photo: content
            };
            self.sendPhoto(message, function (response) {
              callback(null, response);
            });
          },
          function (callback) {
            var message = {
              chat_id: result.message.chat.id,
              audio: content
            };
            self.sendAudio(message, function (response) {
              callback(null, response);
            });
          },
          function (callback) {
            var message = {
              chat_id: result.message.chat.id,
              video: content
            };
            self.sendVideo(message, function (response) {
              callback(null, response);
            });
          }
        ], function (err, responses) {
          if (err) {
            console.error(err);
          }
          if (responses.every(function (response) {
            return !response.ok;
          })) {
            var message = {
              chat_id: result.message.chat.id,
              document: content
            };
            console.log('doc confirmed');
            self.sendDocument(message, function (response) {
              console.log('response received', response);
            });
          }
        });
      };

      // Handle text messages
      if (result.message.text) {
        var command = result.message.text.split(' ')[0];
        var listeners = util.inspect(self.listeners(command));
        if (listeners !== '[]') {
          self.emit(command, result);
        } else {
          self.emit('_default', result);
        }
      }
      // TODO: Handle _joinGroup and similar messages
      // Update offset
      offset = result.update_id + 1;
    });
    // Check again after handling updates
    self.init();
  }

  // Start checking for updates
  self.init = function (update_id) {
    // Allow a custom update_id
    if (update_id) {
      offset = update_id;
    }
    // If there are updates, handle them
    self.getUpdates({
      offset: offset,
      timeout: TIMEOUT
    }, handleUpdates);
  };

  // API methods implemented in JavaScript
  /**
   * Get info about the bot
   * @param  {Function} callback Callback function
   */
  self.getMe = function (callback) {
    lib.sendRequest({
      url: BASE_URL + '/getMe'
    }, callback);
  };

  /**
   * Send a text message
   * @param  {Object}   params   {chat_id, text, disable_web_page_preview, reply_to_message_id, reply_markup}
   * @param  {Function} callback Callback function
   */
  self.sendMessage = function (params, callback) {
    lib.sendRequest({
      url: BASE_URL + '/sendMessage',
      form: params
    }, callback);
  };

  /**
   * Forward a received message
   * @param  {Object}   params   {chat_id, from_chat_id, message_id}
   * @param  {Function} callback Callback function
   */
  self.forwardMessage = function (params, callback) {
    lib.sendRequest({
      url: BASE_URL + '/forwardMessage',
      form: params
    }, callback);
  };

  /**
   * Send a photo
   * @param  {Object}   params   {chat_id, photo, caption, reply_to_message_id, reply_markup}
   * @param  {Function} callback Callback function
   */
  self.sendPhoto = function (params, callback) {
    lib.sendRequest({
      url: BASE_URL + '/sendPhoto',
      formData: params
    }, callback);
  };

  /**
   * Send an audio
   * @param  {Object}   params   {chat_id, audio, reply_to_message_id, reply_markup}
   * @param  {Function} callback Callback function
   */
  self.sendAudio = function (params, callback) {
    lib.sendRequest({
      url: BASE_URL + '/sendAudio',
      formData: params
    }, callback);
  };

  /**
   * Send an arbitrary file
   * @param  {Object}   params   {chat_id, document, reply_to_message_id, reply_markup}
   * @param  {Function} callback Callback function
   */
  self.sendDocument = function (params, callback) {
    lib.sendRequest({
      url: BASE_URL + '/sendDocument',
      formData: params
    }, callback);
  };

  /**
   * Send a sticker
   * @param  {Object}   param    {chat_id, sticker, reply_to_message_id, reply_markup}
   * @param  {Function} callback Callback function
   */
  self.sendSticker = function (params, callback) {
    lib.sendRequest({
      url: BASE_URL + '/sendSticker',
      formData: params
    }, callback);
  };

  /**
   * Send a video
   * @param  {Object}   params   {chat_id, video, reply_to_message_id, reply_markup}
   * @param  {Function} callback Callback function
   */
  self.sendVideo = function (params, callback) {
    lib.sendRequest({
      url: BASE_URL + '/sendVideo',
      formData: params
    }, callback);
  };

  /**
   * Send a geographic location
   * @param  {Object}   params   {chat_id, latitude, longitude, reply_to_message_id}
   * @param  {Function} callback Callback function
   */
  self.sendLocation = function (params, callback) {
    lib.sendRequest({
      url: BASE_URL + '/sendLocation',
      form: params
    }, callback);
  };

  /**
   * Display a chat action
   * @param  {Object}   params   {chat_id, action}
   * @param  {Function} callback Callback function
   */
  self.sendChatAction = function (params, callback) {
    lib.sendRequest({
      url: BASE_URL + '/sendChatAction',
      form: params
    }, callback);
  };

  /**
   * Get a list of a user"s profile photos
   * @param  {Object}   params   {user_id, offset, limit}
   * @param  {Function} callback Callback function
   */
  self.getUserProfilePhotos = function (params, callback) {
    lib.sendRequest({
      url: BASE_URL + '/getUserProfilePhotos',
      form: params
    }, callback);
  };

  /**
   * Get new messages
   * @param  {Object}   params   {offset, limit, timeout}
   * @param  {Function} callback Callback function
   */
  self.getUpdates = function (params, callback) {
    lib.sendRequest({
      url: BASE_URL + '/getUpdates',
      form: params
    }, callback);
  };

  // self.setWebhook = function () {};
  return this;
};

util.inherits(Bub, require('events')
  .EventEmitter);

module.exports = Bub;
