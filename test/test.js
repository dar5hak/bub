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



jest.dontMock('../src/bub');

describe('Bub', () => {
	'use strict';
	var Bub = require('../src/bub');

	it('is a class', () => {
		expect(typeof Bub).toBe('function');
	});

	it('requires config', () => {
		try {
			/*eslint no-new: 0*/
			new Bub();
		} catch (err) {
			expect(err).toMatch(/config is required/);
		}
	});

	describe('bot', () => {
		var config = {
			token: '80512814:AAFkyYhScAO25wfU9f3zIq-D3W868o-7oTU'
		};
		var bot = new Bub(config);
		var request = require('request');
		var BASE_URL = 'https://api.telegram.org/bot' + config.token;

		it('is an object', () => {
			expect(typeof bot).toBe('object');
		});

		it('has the right properties', () => {
			expect(bot.init).toBeDefined();
		});

		it('emits events', () => {
			expect(bot.on).toBeDefined();
		});

		describe('init', () => {
			it('checks for updates', () => {
				bot.init();
				expect(request.post).toBeCalledWith(jasmine.objectContaining({
					url: BASE_URL + '/getUpdates'
				}), jasmine.any(Function));
			});
		});
	});
});
