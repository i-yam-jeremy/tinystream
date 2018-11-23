'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: './test-src/index.js',
	output: {
		path: path.resolve(__dirname, 'test'),
		publicPath: '/test/',
		filename: 'tinystream.js'
	}
};
