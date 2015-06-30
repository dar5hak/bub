var fs = require('fs');
var path = require('path');
var request = require('hopjs-request');

module.exports = function (config) {
  var baseUrl = 'https://api.telegram.org/bot' + config.token;
  var pollTimeout = config.timeout ? config.timeout : 86400;
  var offset = null;

  // List of handler methods specified by the user
  var callbacks = {};
  this.on = function (command, callback) {
    if (callback) {
      if (command) callbacks[command] = callback;
      else callbacks._default = callback;
    }
  };

  // Start checking for updates
  this.init = function (update_id) {
    // Allow a custom update_id
    if (update_id) offset = update_id;
    // If there are updates, handle them
    this.getUpdates(offset, null, pollTimeout, handleUpdates);
  };

  function handleUpdates(body) {
    body.result.forEach(function (result, index, results) {
      // Handle text messages
      if (result.message.text) {
        var command = result.message.text.split(' ')[0];
        if (callbacks[command]) callbacks[command](result);
        else if (callbacks._default) callbacks._default(result);
        else console.error('ERROR: No method to handle this message:\n' + result);
      }
      // TODO: Handle _joinGroup and similar messages
      // Update offset
      offset = result.update_id + 1;
    });
    // Check again after handling updates
    this.init();
  }

  // Generic method to send HTTPS requests
  function sendRequest(params, callback) {
    request.post(params, function (err, res, body) {
      if (err) console.error(err);
      if (callback) callback(JSON.parse(body));
    });
  }

  // API methods implemented in JavaScript
  this.getMe = function (callback) {
    sendRequest({
      url: baseUrl + '/getMe',
    }, callback);
  };

  this.sendMessage = function (chat_id, text, disable_web_page_preview, reply_to_message_id, reply_markup, callback) {
    sendRequest({
      url: baseUrl + '/sendMessage',
      form: {
        chat_id: chat_id,
        text: text,
        disable_web_page_preview: disable_web_page_preview,
        reply_to_message_id: reply_to_message_id,
        reply_markup: reply_markup
      }
    }, callback);
  };

  this.forwardMessage = function (chat_id, from_chat_id, message_id, callback) {
    sendRequest({
      url: baseUrl + '/forwardMessage',
      form: {
        chat_id: chat_id,
        from_chat_id: from_chat_id,
        message_id: message_id
      }
    }, callback);
  };

  this.sendPhoto = function (chat_id, photo, caption, reply_to_message_id, reply_markup, callback) {
    sendRequest({
      url: baseUrl + '/sendPhoto',
      formData: {
        chat_id: chat_id,
        photo: photo,
        caption: caption,
        reply_to_message_id: reply_to_message_id,
        reply_markup: reply_markup
      }
    }, callback);
  };

  this.sendAudio = function (chat_id, audio, reply_to_message_id, reply_markup, callback) {
    sendRequest({
      url: baseUrl + '/sendAudio',
      formData: {
        chat_id: chat_id,
        audio: audio,
        reply_to_message_id: reply_to_message_id,
        reply_markup: reply_markup
      }
    }, callback);
  };

  this.sendDocument = function (chat_id, document, reply_to_message_id, reply_markup, callback) {
    sendRequest({
      url: baseUrl + '/sendDocument',
      formData: {
        chat_id: chat_id,
        document: document,
        reply_to_message_id: reply_to_message_id,
        reply_markup: reply_markup
      }
    }, callback);
  };

  this.sendSticker = function (chat_id, sticker, reply_to_message_id, reply_markup, callback) {
    sendRequest({
      url: baseUrl + '/sendSticker',
      formData: {
        chat_id: chat_id,
        sticker: sticker,
        reply_to_message_id: reply_to_message_id,
        reply_markup: reply_markup
      }
    }, callback);
  };

  this.sendVideo = function (chat_id, video, reply_to_message_id, reply_markup, callback) {
    sendRequest({
      url: baseUrl + '/sendVideo',
      formData: {
        chat_id: chat_id,
        video: video,
        reply_to_message_id: reply_to_message_id,
        reply_markup: reply_markup
      }
    }, callback);
  };

  this.sendLocation = function (chat_id, latitude, longitude, reply_to_message_id, reply_markup) {
    sendRequest({
      url: baseUrl + '/sendLocation',
      form: {
        chat_id: chat_id,
        latitude: latitude,
        longitude: longitude,
        reply_to_message_id: reply_to_message_id,
        reply_markup: reply_markup
      }
    }, callback);
  };

  this.sendChatAction = function (chat_id, action) {
    sendRequest({
      url: baseUrl + '/sendChatAction',
      form: {
        chat_id: chat_id,
        action: action
      }
    }, callback);
  };

  this.getUserProfilePhotos = function (user_id, offset, limit, callback) {
    sendRequest({
      url: baseUrl + '/getUserProfilePhotos',
      form: {
        user_id: user_id,
        offset: offset,
        limit: limit
      }
    }, callback);
  };

  this.getUpdates = function (offset, limit, timeout, callback) {
    sendRequest({
      url: baseUrl + '/getUpdates',
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