'use strict';

var gulp = require('gulp');
var server = require('browser-sync').create();

gulp.task('html:update', function (cb) {
  server.reload();
  cb();
});

gulp.task('js:update', function (cb) {
  server.reload();
  cb();
});

gulp.task('server', function () {
  server.init({
    server: '.',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('*.html', ['html:update']);
  gulp.watch('js/**/*.js', ['js:update']);
});
