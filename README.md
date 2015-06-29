# bub
A framework to build Telegram bots with Node

Currently in _very_ early stages.

## Installation
```bash
$ npm install bub --save
```

## Configuration
Create a file called `bub.json` in your project root.
```json
{
  "token": "your_token_here"
}
```

## Usage
As of now, you can use the Telegram API methods as JavaScript functions, with an additional callback argument. The response body is passed to the callback as a JavaScript object.

```javascript
var bub = require('bub');

bub.getMe(function (body) {
  console.log('Received object:\n' + body);
});
```

You can also define handlers for a command (which is, for now, the first word of the message text).

```javascript
var bub = require('bub');

bub.on('/start', function (result) {
  bub.sendMessage(result.message.chat.id, 'Hello there!', null, null, null, function () {
    console.log('Message sent.');
  });
});

bub.init();
```

The `init()` function starts checking for updates and handling them.

That's about it till now. More coming soon.

## Roadmap
- 0.2.0: Switch to Node's `events` module
- 0.3.0: Add a smart convenience method to send any kind of message based on input
- Somewhere down the road: integrate a proper test framework and manage it with gulp
