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
var mime = require('mime');
var path = require('path');
var request = require('request');
var util = require('util');
var _ = require('lodash');

// Constructor for the whole darn thing
var Bub = function (config) {
  'use strict';
  var BASE_URL = 'https://api.telegram.org/bot' + config.token;
  var TIMEOUT = config.timeout || 864000;
  var offset = null;

  // A reference to `this`, required for emitting events
  var self = this;

  // What API method to use based on the mime type provided
  function getAPIMethod(mimeType) {
    if (_.startsWith(mimeType, 'image')) {
      return self.sendPhoto;
    } else if (_.startsWith(mimeType, 'audio')) {
      return self.sendAudio;
    } else if (_.startsWith(mimeType, 'video')) {
      return self.sendVideo;
    } else {
      return self.sendDocument;
    }
  }

  // Closure that returns a `respond()` function for each chat_id
  function getRespond(id) {
    return function (content) {
      // Strings are text messsages, streams are media
      if (_.isString(content)) {
        self.sendMessage({
          chat_id: id,
          text: content
        });
        return;
      } else if (isStream.readable(content)) {
        if (content.path) {
          var contentPath = path.resolve(content.path);
          var method = getAPIMethod(mime.lookup(contentPath));

          // `_media` is generic for `photo`, `audio`, etc.
          // It is resolved to the right param internally.
          method({
            chat_id: id,
            _media: content
          });
        }
      } else {
        console.error(
          'The argument to `respond()` should be a string or a readable stream.'
        );
      }
    };
  }

  // What to do with each update
  function handleUpdates(body) {
    body.result.forEach(function (result) {
      // Convenience method for quick responses
      result.respond = getRespond(result.message.chat.id);

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
      if (result.message.new_chat_participant) {
        var newMember = result.message.new_chat_participant;
        self.getMe(function (me) {
          console.log(me);
          if (me.result.id === newMember.id) {
            self.emit('_joinGroup', result);
          } else {
            self.emit('_newMember', result);
          }
        });
      }
      // Telegram servers can now safely forget older messages
      offset = result.update_id + 1;
    });
    // Check again after handling updates
    self.init();
  }

  // Send a generic HTTPS request
  function sendRequest(params, callback) {
    request.post(params, function (err, res, body) {
      if (err) {
        console.error(err);
      }
      if (callback) {
        callback(JSON.parse(body));
      }
    });
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
    sendRequest({
      url: BASE_URL + '/getMe'
    }, callback);
  };

  /**
   * Send a text message
   * @param  {Object}   params   {chat_id, text, disable_web_page_preview, reply_to_message_id, reply_markup}
   * @param  {Function} callback Callback function
   */
  self.sendMessage = function (params, callback) {
    sendRequest({
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
    sendRequest({
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
    if (params._media) {
      params.photo = params._media;
      delete params._media;
    }
    sendRequest({
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
    if (params._media) {
      params.audio = params._media;
      delete params._media;
    }
    sendRequest({
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
    if (params._media) {
      params.document = params._media;
      delete params._media;
    }
    sendRequest({
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
    sendRequest({
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
    if (params._media) {
      params.video = params._media;
      delete params._media;
    }
    sendRequest({
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
    sendRequest({
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
    sendRequest({
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
    sendRequest({
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
    sendRequest({
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
