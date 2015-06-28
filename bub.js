var fs = require('fs');
var path = require('path');
var request = require('hopjs-request');
var config = require('../../bub.json'); //FIXME: Remove hardcode

var baseUrl = 'https://api.telegram.org/bot' + config.token;
var pollTimeout = config.timeout ? config.timeout : 3600;
var offset = null;

var callbacks = {};
exports.on = function (command, callback) {
  if (callback) {
    if (command) callbacks[command] = callback;
    else callbacks._default = callback;
  }
};

exports.init = function (update_id) {
  thid.update_id = update_id ? update_id : offset;
  exports.getUpdates(offset, null, pollTimeout, handleUpdates);
};

function handleUpdates(body) {
  body.result.forEach(function (result, index, results) {
    if (result.message.text) {
      var command = result.message.text.split(' ')[0];
      if (callbacks[command]) callbacks[command](result);
      else if (callbacks._default) callbacks._default(result);
      else console.error('ERROR: No method to handle this message:\n' + result);
    }
    // TODO: Handle _joinGroup and similar messages
    offset = result.update_id;
  });
}

function sendRequest(params, callback) {
  request.post(params, function (err, res, body) {
    if (err) console.error(err);
    if (callback) callback(JSON.parse(body));
  });
}

exports.getMe = function (callback) {
  sendRequest({
    url: baseUrl + '/getMe',
  }, callback);
};

exports.sendMessage = function (chat_id, text, disable_web_page_preview, reply_to_message_id, reply_markup, callback) {
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

exports.forwardMessage = function (chat_id, from_chat_id, message_id, callback) {
  sendRequest({
    url: baseUrl + '/forwardMessage',
    form: {
      chat_id: chat_id,
      from_chat_id: from_chat_id,
      message_id: message_id
    }
  }, callback);
};

exports.sendPhoto = function (chat_id, photo, caption, reply_to_message_id, reply_markup, callback) {
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

exports.sendAudio = function (chat_id, audio, reply_to_message_id, reply_markup, callback) {
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

exports.sendDocument = function (chat_id, document, reply_to_message_id, reply_markup, callback) {
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

exports.sendSticker = function (chat_id, sticker, reply_to_message_id, reply_markup, callback) {
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

exports.sendVideo = function (chat_id, video, reply_to_message_id, reply_markup, callback) {
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

exports.sendLocation = function (chat_id, latitude, longitude, reply_to_message_id, reply_markup) {
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

exports.sendChatAction = function (chat_id, action) {
  sendRequest({
    url: baseUrl + '/sendChatAction',
    form: {
      chat_id: chat_id,
      action: action
    }
  }, callback);
};

exports.getUserProfilePhotos = function (user_id, offset, limit, callback) {
  sendRequest({
    url: baseUrl + '/getUserProfilePhotos',
    form: {
      user_id: user_id,
      offset: offset,
      limit: limit
    }
  }, callback);
};

exports.getUpdates = function (offset, limit, timeout, callback) {
  sendRequest({
    url: baseUrl + '/getUpdates',
    form: {
      offset: offset,
      limit: limit,
      timeout: timeout
    }
  }, callback);
};

//exports.setWebhook = function () {};