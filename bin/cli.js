#!/usr/bin/env node

'use strict';
var gulp = require( 'gulp' );
var argv = require('minimist')(process.argv.slice(2));
var senseGo = require( './../lib/' );

senseGo.init( gulp, function () {
	
	gulp.series( argv._)();

} );
