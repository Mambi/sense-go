'use strict';
var gUtil = require( 'gulp-util' );
var del = require('del');
var path = require('path');

module.exports = function ( gulp , cfg, plugins ) {

	return function ( callback ) {
		return del( path.resolve(cfg.tmpDir) , callback);
	};
};