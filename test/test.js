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
