'use strict';
var fs = require( 'fs' );
var path = require( 'path' );
var gulp = require( 'gulp' );
var chai = require( 'chai' );
chai.use( require( 'chai-fs' ) );
var expect = chai.expect;
var pluginLoaderCfg = require( './pluginLoaderCfg.js' );
var pluginLoader = require( 'gulp-load-plugins' );
var taskLoader = require( 'gulp-simple-task-loader' );
var rimraf = require( 'rimraf' );

var DEBUG = true;
var plugins = pluginLoader( pluginLoaderCfg );
var tasksCfg = {
	"debug": {
		minimal: false
	},
	"lessEach": {
		options: {
			cwd: __dirname
		},
		src: './fixtures/lessEach/**/*.less',
		dest: './tmp/lessEach'
	},
	"lessReduce": {
		options: {
			cwd: __dirname
		},
		src: './fixtures/lessReduce/root.less',
		dest: './tmp/lessReduce'
	}
};

function delTemp ( done ) {
	if (!DEBUG) {
		rimraf( path.join( __dirname, './tmp' ), function ( e ) {
			console.info('Deleted tmp');
			return done();
		} )
	} else {
		return done();
	}

}

xdescribe( 'gulp', function () {

	beforeEach( function ( done ) {

		rimraf( './tmp', function () {
			var taskLoaderCfg = require( './taskLoaderConfig' )( plugins, tasksCfg );
			taskLoader( taskLoaderCfg );
			done();
		} );

	} );

	//Todo: doesn't seem to work
	afterEach( function ( done ) {
		delTemp(done);
	} );

	it( 'taskLoader returns tasks', function ( done ) {
		console.log( 'gulp.tasks', gulp.tasks );
		expect( gulp.tasks ).not.to.be.undefined;
		expect( gulp.tasks ).to.have.property( 'lessEach' );
		expect( gulp.tasks ).to.have.property( 'lessReduce' );
		done();
	} );

	describe( 'lessEach', function () {

		afterEach( function ( done ) {
			delTemp(done);
		} );

		it( 'lessEach: converts less for each less file', function ( done ) {

			gulp.start.apply( gulp, ['lessEach'] );
			gulp.on( 'task_stop', function ( e ) {
				expect( path.join( __dirname, './tmp/lessEach/root.css' ) ).to.be.a.file();
				expect( path.join( __dirname, './tmp/lessEach/variables.css' ) ).to.be.a.file();
				expect( path.join( __dirname, './tmp/lessEach/whatever.css' ) ).to.be.a.file();
				expect( path.join( __dirname, './tmp/lessEach/root.css' ) ).to.have.content( fs.readFileSync( path.join( __dirname, './expected/lessEach/root.css' ), 'utf8' ) );
				expect( path.join( __dirname, './tmp/lessEach/whatever.css' ) ).to.have.content( fs.readFileSync( path.join( __dirname, './expected/lessEach/whatever.css' ), 'utf8' ) );
				done();
			} );
		} );
	} );

	describe( 'lessReduce', function () {

		afterEach( function (done ) {
			delTemp(done);
		} );

		it( 'reduces all .less files to a single .css file', function ( done ) {
			gulp.start.apply( gulp, ['lessReduce'] );
			gulp.on('task_stop', function ( e ) {
				expect( path.join( __dirname, './tmp/lessReduce/root.css' ) ).to.be.a.file().and.not.empty;
				expect( path.join( __dirname, './tmp/lessReduce/root.css' ) ).to.have.content( fs.readFileSync( path.join( __dirname, './expected/lessReduce/root.css'), 'utf8'));

				// Todo: doesn't work
				//expect( path.join( __dirname, './tmp/lessReduce/variables.css' ) ).to.not.be.a.file();
				//expect( path.join( __dirname, './tmp/lessReduce/whatever.css' ) ).to.not.be.a.file();
				done();
			});
		} );

	} );

} );
