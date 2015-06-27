var fs = require('fs');
var path = require('path');
var request = require('hopjs-request');

var config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../bub.json')));
var baseUrl = 'https://api.telegram.org/bot' + config.token;

exports.on = function (command, callback) {
  // body
};

exports.getMe = function (callback) {
  request.post({
    url: baseUrl + '/getMe'
  }, function (err, res, body) {
    if (err) console.error(err);
    if (callback) callback(JSON.parse(body));
  });
};

exports.sendMessage = function () {
  // body
};

exports.forwardMessage = function () {
  // body
};

exports.sendPhoto = function () {
  // body
};

exports.sendAudio = function () {
  // body
};

exports.sendDocument = function () {
  // body
};

exports.sendSticker = function () {
  // body
};

exports.sendVideo = function () {
  // body
};

exports.sendLocation = function () {
  // body
};

exports.sendChatAction = function () {
  // body
};

exports.getUserProfilePhotos = function () {
  // body
};

exports.getUpdates = function () {
  // body
};

exports.setWebhook = function () {
  // body
};

exports.init = function () {
  // body
};