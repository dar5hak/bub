# bub
A framework for building Telegram bots with Node.

Currently in early stages.

Please go through the [Telegram Bot API](https://core.telegram.org/bots/api) first.

## Installation
```bash
$ npm install bub --save
```

## Configuration
I recommend that you store your config (which contains the API token) in a separate JSON file, say `bub.json`. That way, if you want to share your code, you can simply omit the file.

```json
{
  "token": "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
  "timeout": 3600
}
```

If your bot doesn't receive any messages for `timeout` number of seconds, it will stop checking for more. Default is 10 days.

## Usage
You can use the Telegram API methods as JavaScript functions. All arguments specified in the API can be passed via an object in the first parameter. The second argument is a callback, which you can use for your own functionality.

```javascript
var config = require('./bub.json');
var Bub = require('bub');
var bot = new Bub(config);

// No parameters for getMe
bot.getMe(function (body) {
  console.log('Received object:');
  console.log(body);
});

// For sendChatAction, parameters go into the first argument
bot.sendChatAction({
  chat_id: 123456789,
  action: typing
}, function (body) {
  console.log('Received object:');
  console.log(body);
});
```

You can also define handlers for a command (which is simply the first word of the message text).

```javascript
var config = require('./bub.json');
var Bub = require('bub');
var bot = new Bub(config);

bot.on('/start', function (result) {
  console.log('/start command received');
});

bot.on('_default', console.log);

bot.init();
```

The `_default` handler handles anything for which a handler is not specified.

The `init()` function starts checking for updates and handles them.

That's about it till now. More coming soon.

## Roadmap
- 0.3.0: Add a smart convenience method to send any kind of message based on input
- Somewhere down the road: integrate a proper test framework and manage it with gulp
