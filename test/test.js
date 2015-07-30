var expect = require('expect.js');

describe('Bub', function () {
  'use strict';
  var Bub = require('../src/bub');

  it('is a class', function () {
    expect(Bub).to.be.a('function');
  });

  it('requires config', function () {
    try {
      /*eslint no-new: 0*/
      new Bub();
    } catch (err) {
      expect(err).to.match(/config is required/);
    }
  });

  describe('bot', function () {
    var config = {
      token: '80512814:AAFkyYhScAO25wfU9f3zIq-D3W868o-7oTU'
    };
    var bot = new Bub(config);

    it('is an object', function () {
      expect(bot).to.be.an('object');
    });

    it('has the right properties', function () {
      expect(bot).to.have.property('init');
    });

    it('emits events', function () {
      expect(bot).to.have.property('on');
    });
  });
});
