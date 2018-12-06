'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/build/',
		filename: 'tinystream.js'
	},
	stats: 'minimal'
};
