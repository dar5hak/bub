var expect = require('expect.js');

describe('Bub', function () {
  var Bub = require('../src/bub');

  it('is a class', function () {
    expect(Bub).to.be.a('function');
  });

  it('requires config', function () {
    try {
      var emptyBot = new Bub();
    } catch (err) {
      expect(err).to.match(/config is required/);
    }
  });

  var config = {
    token: '80512814:AAFkyYhScAO25wfU9f3zIq-D3W868o-7oTU'
  };
  var bot = new Bub(config);

  it('creates an object', function () {
    expect(bot).to.be.an('object');
  });
});
