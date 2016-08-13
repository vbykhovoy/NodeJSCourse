var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('copy', function(){
     gulp.src(['bower_components/angularjs/angular.min.js',
                     'bower_components/jquery/dist/jquery.min.js',
                     'bower_components/jquery/dist/jquery.min.map',
                     'bower_components/angularjs/angular.min.js.map',
                     'bower_components/jquery-ui/jquery-ui.min.js',
                     'bower_components/jquery-validation/dist/jquery.validate.min.js',
                     'bower_components/bootstrap/dist/js/bootstrap.min.js',
                     'bower_components/angular-scroll-glue/src/scrollglue.js'])
        .pipe(gulp.dest('public/javascripts'));

     gulp.src(['bower_components/bootstrap/dist/css/bootstrap.min.css'])
        .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('copy-app-dev', function(){
    gulp.src('public/application/*.js')
        .pipe(gulp.dest('public/javascripts'));
});

gulp.task('compress', function() {
    return gulp.src('public/application/*.js')
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('public/javascripts'));
});


gulp.task('default', ['copy', 'compress'], function() {
});

gulp.task('dev', ['copy', 'copy-app-dev'], function() {
});