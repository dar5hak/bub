var fs = require('fs');
var path = require('path');
var request = require('hopjs-request');
var util = require('util');

// Constructor for the whole darn thing
var Bub = function (config) {
  var BASE_URL = 'https://api.telegram.org/bot' + config.token;
  var TIMEOUT = config.timeout ? config.timeout : 864000;
  var offset = null;

  // A reference to `this`, required for emitting events
  var self = this;

  // Start checking for updates
  self.init = function (update_id) {
    // Allow a custom update_id
    if (update_id) offset = update_id;
    // If there are updates, handle them
    self.getUpdates(offset, null, TIMEOUT, handleUpdates);
  };

  function handleUpdates(body) {
    body.result.forEach(function (result, index, results) {
      // Handle text messages
      if (result.message.text) {
        var command = result.message.text.split(' ')[0];
        var listeners = util.inspect(self.listeners(command));
        if (listeners !== '[]') self.emit(command, result);
        else self.emit('_default', result);
      }
      // TODO: Handle _joinGroup and similar messages
      // Update offset
      offset = result.update_id + 1;
    });
    // Check again after handling updates
    self.init();
  }

  // Generic method to send HTTPS requests
  function sendRequest(params, callback) {
    request.post(params, function (err, res, body) {
      if (err) console.error(err);
      if (callback) callback(JSON.parse(body));
    });
  }

  // API methods implemented in JavaScript
  self.getMe = function (callback) {
    sendRequest({
      url: BASE_URL + '/getMe',
    }, callback);
  };

  self.sendMessage = function (chat_id, text, disable_web_page_preview, reply_to_message_id, reply_markup, callback) {
    sendRequest({
      url: BASE_URL + '/sendMessage',
      form: {
        chat_id: chat_id,
        text: text,
        disable_web_page_preview: disable_web_page_preview,
        reply_to_message_id: reply_to_message_id,
        reply_markup: reply_markup
      }
    }, callback);
  };

  self.forwardMessage = function (chat_id, from_chat_id, message_id, callback) {
    sendRequest({
      url: BASE_URL + '/forwardMessage',
      form: {
        chat_id: chat_id,
        from_chat_id: from_chat_id,
        message_id: message_id
      }
    }, callback);
  };

  self.sendPhoto = function (chat_id, photo, caption, reply_to_message_id, reply_markup, callback) {
    sendRequest({
      url: BASE_URL + '/sendPhoto',
      formData: {
        chat_id: chat_id,
        photo: photo,
        caption: caption,
        reply_to_message_id: reply_to_message_id,
        reply_markup: reply_markup
      }
    }, callback);
  };

  self.sendAudio = function (chat_id, audio, reply_to_message_id, reply_markup, callback) {
    sendRequest({
      url: BASE_URL + '/sendAudio',
      formData: {
        chat_id: chat_id,
        audio: audio,
        reply_to_message_id: reply_to_message_id,
        reply_markup: reply_markup
      }
    }, callback);
  };

  self.sendDocument = function (chat_id, document, reply_to_message_id, reply_markup, callback) {
    sendRequest({
      url: BASE_URL + '/sendDocument',
      formData: {
        chat_id: chat_id,
        document: document,
        reply_to_message_id: reply_to_message_id,
        reply_markup: reply_markup
      }
    }, callback);
  };

  self.sendSticker = function (chat_id, sticker, reply_to_message_id, reply_markup, callback) {
    sendRequest({
      url: BASE_URL + '/sendSticker',
      formData: {
        chat_id: chat_id,
        sticker: sticker,
        reply_to_message_id: reply_to_message_id,
        reply_markup: reply_markup
      }
    }, callback);
  };

  self.sendVideo = function (chat_id, video, reply_to_message_id, reply_markup, callback) {
    sendRequest({
      url: BASE_URL + '/sendVideo',
      formData: {
        chat_id: chat_id,
        video: video,
        reply_to_message_id: reply_to_message_id,
        reply_markup: reply_markup
      }
    }, callback);
  };

  self.sendLocation = function (chat_id, latitude, longitude, reply_to_message_id, reply_markup) {
    sendRequest({
      url: BASE_URL + '/sendLocation',
      form: {
        chat_id: chat_id,
        latitude: latitude,
        longitude: longitude,
        reply_to_message_id: reply_to_message_id,
        reply_markup: reply_markup
      }
    }, callback);
  };

  self.sendChatAction = function (chat_id, action) {
    sendRequest({
      url: BASE_URL + '/sendChatAction',
      form: {
        chat_id: chat_id,
        action: action
      }
    }, callback);
  };

  self.getUserProfilePhotos = function (user_id, offset, limit, callback) {
    sendRequest({
      url: BASE_URL + '/getUserProfilePhotos',
      form: {
        user_id: user_id,
        offset: offset,
        limit: limit
      }
    }, callback);
  };

  self.getUpdates = function (offset, limit, timeout, callback) {
    sendRequest({
      url: BASE_URL + '/getUpdates',
      form: {
        offset: offset,
        limit: limit,
        timeout: timeout
      }
    }, callback);
  };

  // this.setWebhook = function () {};
  return this;
};

util.inherits(Bub, require('events').EventEmitter);

module.exports = Bub;