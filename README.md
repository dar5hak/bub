# bub
Telegram bot framework

Please go through the [Telegram Bot API](https://core.telegram.org/bots/api) first.

## Get

```bash
npm install bub --save
```

## Set
Try and keep your config in a separate JSON file, say `bub.json`. That way, you can share your code without sharing your API token.

```json
{
  "token": "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
  "timeout": 3600
}
```

If your bot doesn't receive any messages for `timeout` number of seconds, it will stop checking for more. Default is 10 days.

## Go

```javascript
var config = require('./bub.json');
var Bub = require('bub');
var bot = new Bub(config);

var fs = require('fs');

// User commands are handled with `on()`
bot.on('/start', function (result) {
  // Quick responses are easy-peasy
  result.respond('Hello, ' + result.message.from.first_name);
  // Shoot a stream for photos, audio and video
  result.respond(fs.createReadStream('/home/me/image.png'));
});

bot.on('/longstory', function (result) {
  // Plain old API methods
  bot.sendChatAction({
    chat_id: 123456789,
    action: 'typing'
  }, function (body) {
    console.log('Typing…');
  });
});

// Anything without handlers goes here
bot.on('_default', console.log);

// Start checking for updates and handle them
bot.init();
```

## Roadmap
- [x] Add a convenience method `respond()` for quick responses
- [x] Improve `respond()` to send any kind of message based on the argument
- [ ] Add webhook support
- [ ] Write tests
