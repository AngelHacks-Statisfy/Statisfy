'use strict';
/**
 * @module gulp
 * Build configuration file with proper linting rules.
 */

/** Modules import */
var config = require('config');
var gulp = require('gulp');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var fs = require('fs');
var buffer = require('gulp-buffer');
var clean = require('gulp-clean');
var awspublish = require('gulp-awspublish');
var zip = require('gulp-zip');
var seq = require('gulp-sequence');

/** Local Imports */
var logManager = require('./utils/log-manager.js');

/** Global Vars */
var logger = logManager.getLogger();
var SRC = ['./routes/**', './secret/*.js', './server/**', 'services/*.js', 'utils/*.js', './config/**', 'app.js', 'package.json', 'server.js'];

/** Begin */
gulp.task('begin', function () {
    logger.info('Build Started');
    gulp.src('./*.js')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .on('finish', function () { gutil.log('Packaging!!'); });
});

/** Clean the dist folder */
gulp.task('clean', function () {
    logger.info('Cleaning dist folder');
    return gulp.src('./dist/*', {read: false})
        .pipe(buffer())
        .pipe(clean());
});

/** Package the directory */
gulp.task('package', function () {
    return gulp.src(SRC, {base: '.'})
        .pipe(zip('angelhacks.tar.gz'))
        .pipe(buffer())
        .pipe(gulp.dest('dist'));
});

/** Publish it to S3 */
gulp.task('publish', function () {
    logger.info('Preparing to Publish!!');
    var publisher = awspublish.create({
        params: {
            Bucket: config.AWS_CONFIG.bucket_name
        },
        'accessKeyId': config.AWS_CONFIG.accessKeyId,
        'secretAccessKey': config.AWS_CONFIG.secretAccessKey
    });

    /** define custom headers */
    var headers = {
        'Cache-Control': 'max-age=315360000, no-transform, private'
        /** ... if anything else that needs to be added */
    };

    return gulp.src('./dist/pre-webapp.tar.gz')
        /** publisher will add Content-Length, Content-Type and headers specified above */
        /** If not specified it will set x-amz-acl to public-read by default */
        .pipe(publisher.publish(headers))

        /** print upload updates to console */
        .pipe(awspublish.reporter());
});

/** Emit done. */
gulp.task('done', function () {
    logger.info('Done::::');

    gulp.src('./*.js')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .on('finish', function () { gutil.log('Deployed to S3 Bucket!!'); });
});

gulp.task('default', seq('begin', 'clean', 'package', 'publish', 'done'));

