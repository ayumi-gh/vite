const { src, dest, watch, series, parallel } = require("gulp"); // Gulpの基本関数をインポート
const ejs = require("gulp-ejs"); // EJSをコンパイルするためのモジュール
const sass = require("gulp-sass")(require("sass")); // SCSSをCSSにコンパイルするためのモジュール
const plumber = require("gulp-plumber"); // エラーが発生してもタスクを続行するためのモジュール
const notify = require("gulp-notify"); // エラーやタスク完了の通知を表示するためのモジュール
const sassGlob = require("gulp-sass-glob-use-forward"); // SCSSのインポートを簡略化するためのモジュール
// const mmq = require("gulp-merge-media-queries"); // メディアクエリをマージするためのモジュール
const postcss = require("gulp-postcss"); // CSSの変換処理を行うためのモジュール
const autoprefixer = require("autoprefixer"); // ベンダープレフィックスを自動的に追加するためのモジュール
const cssdeclsort = require("css-declaration-sorter"); // CSSの宣言をソートするためのモジュール
const postcssPresetEnv = require("postcss-preset-env"); // 最新のCSS構文を使用可能にするためのモジュール
const sourcemaps = require("gulp-sourcemaps"); // ソースマップを作成するためのモジュール
const babel = require("gulp-babel"); // ES6+のJavaScriptをES5に変換するためのモジュール
const imageminSvgo = require("imagemin-svgo"); // SVGを最適化するためのモジュール
const browserSync = require("browser-sync"); // ブラウザの自動リロード機能を提供するためのモジュール
const imagemin = require("gulp-imagemin"); // 画像を最適化するためのモジュール
const imageminMozjpeg = require("imagemin-mozjpeg"); // JPEGを最適化するためのモジュール
const imageminPngquant = require("imagemin-pngquant"); // PNGを最適化するためのモジュール
const changed = require("gulp-changed"); // 変更されたファイルのみを対象にするためのモジュール
const del = require("del"); // ファイルやディレクトリを削除するためのモジュール
const webp = require("gulp-webp"); //webp変換
const rename = require("gulp-rename"); //ファイル名変更

// 読み込み先
const srcPath = {
  font: "../src/fonts/**/*",
  css: "../src/scss/**/*.scss",
  js: "../src/js/**/*",
  img: "../src/images/**/*",
  ejs: "../src/ejs/**/*.ejs",
  index: 'src/ejs/index.ejs',
  html: ["../src/**/*.html", "!./node_modules/**"],
};

// html反映用
const destPath = {
  all: "../dist/**/*",
  font: "../dist/assets/fonts/",
  css: "../dist/assets/css/",
  js: "../dist/assets/js/",
  img: "../dist/assets/images/",
  ejs: "../dist/",
  html: "../dist/",
};

const browsers = [
  "last 2 versions",
  "> 5%",
  "ie = 11",
  "not ie <= 10",
  "ios >= 8",
  "and_chr >= 5",
  "Android >= 5",
];

// EJSファイルのコンパイル
const ejsCompile = () => {
    return src([srcPath.ejs, "!" + "../src/ejs/**/_*.ejs", "../src/ejs/**/*.ejs"]) // _から始まるファイルは除外し、下層ディレクトリも対象に
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>"),
      })
    )
    .pipe(ejs({
      basePath: '',
      head: {
        title: '',
        desc: ''
      }
    }, {}, { ext: ".html" }))
    .pipe(rename({ extname: ".html" }))
    .pipe(dest(destPath.ejs))
    .pipe(
      notify({
        message: "EJSをコンパイルしました！",
        onLast: true,
      })
    );
};


// fontファイルのコピー
const fontCopy = () => {
  return src(srcPath.font).pipe(dest(destPath.font));
};

// HTMLファイルのコピー
const htmlCopy = () => {
  return src(srcPath.html).pipe(dest(destPath.html));
};

// CSSファイルのコンパイル
const cssSass = () => {
  return (
    src(srcPath.css)
      .pipe(sourcemaps.init())
      .pipe(
        plumber({
          errorHandler: notify.onError("Error:<%= error.message %>"),
        })
      )
      .pipe(sassGlob())
      .pipe(
        sass.sync({
          includePaths: ["src/scss"],
          outputStyle: "expanded",
        })
      )
      .pipe(
        postcss([
          postcssPresetEnv(),
          autoprefixer({
            grid: true,
          }),
          cssdeclsort({
            order: "alphabetical",
          }),
        ])
    )
      // メディアクエリを統合
      // .pipe(mmq())
      // ソースマップを書き出し
      .pipe(sourcemaps.write("./"))
      // コンパイル済みのCSSファイルを出力先に保存
      .pipe(dest(destPath.css))
      // Sassコンパイルが完了したことを通知
      .pipe(
        notify({
          message: "Sassをコンパイルしました！",
          onLast: true,
        })
      )
  );
};

// 画像圧縮
const imgImagemin = () => {
  // 画像ファイルを指定
  return (
    src(srcPath.img)
      // 変更があった画像のみ処理対象に
      .pipe(changed(destPath.img))
      // 画像を圧縮
      .pipe(
        imagemin(
          [
            // JPEG画像の圧縮設定
            imageminMozjpeg({
              quality: 80, // 圧縮品質（0〜100）
            }),
            // PNG画像の圧縮設定
            imageminPngquant(),
            // SVG画像の圧縮設定
            imageminSvgo({
              plugins: [
                {
                  removeViewbox: false, // viewBox属性を削除しない
                },
              ],
            }),
          ],
          {
            verbose: true, // 圧縮情報を表示
          }
        )
      )
      .pipe(dest(destPath.img))
      .pipe(webp()) //webpに変換
      // 圧縮済みの画像ファイルを出力先に保存
      .pipe(dest(destPath.img))
  );
};

// js圧縮
const jsBabel = () => {
  // JavaScriptファイルを指定
  return (
    src(srcPath.js)
      // エラーハンドリングを設定
      .pipe(
        plumber({
          errorHandler: notify.onError("Error: <%= error.message %>"),
        })
      )
      // Babelでトランスパイル（ES6からES5へ変換）
      .pipe(
        babel({
          presets: ["@babel/preset-env"],
        })
      )
      // 圧縮済みのファイルを出力先に保存
      .pipe(dest(destPath.js))
  );
};

// ブラウザーシンク
const browserSyncOption = {
  notify: false,
  server: "../dist/",
};
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
};
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

// ファイルの削除
const clean = () => {
  return del(destPath.all, { force: true });
};
// ファイルの監視
const watchFiles = () => {
  watch(srcPath.css, series(cssSass, browserSyncReload));
  watch(srcPath.js, series(jsBabel, browserSyncReload));
  watch(srcPath.img, series(imgImagemin, browserSyncReload));
  watch(srcPath.ejs, series(ejsCompile, browserSyncReload));
  watch(srcPath.font, series(fontCopy, browserSyncReload));
  watch(srcPath.html, series(htmlCopy, browserSyncReload));
};

// ブラウザシンク付きの開発用タスク
exports.default = series(
  series(cssSass, jsBabel, imgImagemin, fontCopy, htmlCopy, ejsCompile),
  parallel(watchFiles, browserSyncFunc)
);

// 本番用タスク
exports.build = series(
  clean,
  fontCopy,
  cssSass,
  jsBabel,
  imgImagemin,
  htmlCopy,
  ejsCompile
);
