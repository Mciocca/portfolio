const gulp = require('gulp');
const sass = require('gulp-sass');
const livereload = require('gulp-livereload');
const uglify = require('gulp-uglify');
const pump = require('pump');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('sass',  () => {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(autoprefixer({
          browsers: ['last 2 versions'],
            cascade: false
     }))
    .pipe(sass({style: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
    .pipe(livereload());
});

gulp.task('uglify', (cb) => {
    pump([
        gulp.src('src/js/*.js'),
        uglify(),
        gulp.dest('dist/js'),
        livereload()
    ],
    cb
  );
});

gulp.task('watch', () => {
    livereload.listen();
    gulp.watch('./src/sass/*.scss', ['sass']);
    gulp.watch('./src/js/*.js', ['uglify']);
});