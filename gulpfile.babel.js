import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync'
import del from 'del';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const styles = {
    'in': 'assets/stylesheets/**/*.scss',
    'tmp': '.tmp/css',
};

gulp.task('styles', () => {
    return gulp.src(styles.in)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(styles.tmp))
        .pipe(reload({stream: true}));
});

const scripts = {
    'in': 'assets/javascripts/**/*.js',
    'tmp': '.tmp/js',
    'out': 'dist/js'
};

gulp.task('scripts', () => {
    return gulp.src(scripts.in)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(scripts.tmp))
        .pipe(reload({stream: true}));
});

const lint = {
    'in': 'assets/javascripts/**/*.js'
};
gulp.task('lint', () => {
    return gulp.src(lint.in)
        .pipe(reload({stream: true, once: true}))
        .pipe($.eslint.format())
        .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
});

const html = {
    'in': 'assets/*.html',
    'out': 'dist'
};
gulp.task('html', ['styles', 'scripts'], () => {
    return gulp.src(html.in)
        .pipe($.useref({searchPath: ['.tmp', 'assets', '.']}))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano()))
        .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest(html.out));
});

const images = {
    'in': 'assets/images/**/*',
    'out': 'dist/images'
};
gulp.task('images', () => {
    return gulp.src(images.in)
        .pipe($.imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{cleanupIDs: false}]
        }))
        .pipe(gulp.dest(images.out));
});

const fonts = {
    'in': ['assets/fonts/bootstrap/*'],
    'tmp': '.tmp/fonts',
    'out': 'dist/fonts'
};
gulp.task('fonts', () => {
    return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function(err) {
    })
        .concat(fonts.in))
        .pipe(gulp.dest(fonts.tmp))
        .pipe(gulp.dest(fonts.out));
});

const extras = {
    'in': [
        'assets/*.*',
        '!assets/*.html'
    ],
    'out': 'dist'
};
gulp.task('extras', () => {
    return gulp.src(extras.in, {
        dot: true
    }).pipe(gulp.dest(extras.out));
});

const wire = {
    'in': 'assets/*.html',
    'out': 'dist'
};
gulp.task('wiredep', () => {
    gulp.src(wire.in)
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe($.useref({searchPath: ['.tmp', 'assets', '.']}))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano()))
        .pipe(gulp.dest(wire.out));
});

const serve = {
    'baseDir': ['.tmp', 'assets'],
    'baseDirDist': ['dist'],
    'routes': {
        '/bower_components': 'bower_components'
    },
    'port': 9000
};
gulp.task('serve', ['styles', 'scripts', 'fonts', 'wiredep'], () => {
    browserSync({
        notify: false,
        port: serve.port,
        server: {
            baseDir: serve.baseDir,
            routes: serve.routes
        }
    });
    gulp.watch([
        html.out, scripts.tmp, scripts.out, images.out, fonts.tmp, fonts.out
    ]).on('change', reload);
    gulp.watch(styles.in, ['styles']);
    gulp.watch(scripts.in, ['scripts']);
    gulp.watch(fonts.in, ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
});
gulp.task('serve:dist', () => {
    browserSync({
        notify: false,
        port: serve.port,
        server: {
            baseDir: serve.baseDirDist
        }
    });
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

const build = {
    'in': 'dist/**/*'
};
gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
    return gulp.src(build.in).pipe($.size({title: 'build', gzip: true}));
});
gulp.task('default', ['clean'], () => {
    gulp.start('build');
});
