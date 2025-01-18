import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import { ViteEjsPlugin } from "vite-plugin-ejs";
import ejs from 'ejs';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import viteImagemin from 'vite-plugin-imagemin';
import { globSync } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const jsFiles = Object.fromEntries(
  globSync('src/**/*.js', { ignore: ['node_modules/**','**/modules/**','**/dist/**']}).map(file => [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

const fontFiles = Object.fromEntries(
  globSync('src/fonts/**/*.ttf', { ignore: ['node_modules/**','**/modules/**','**/dist/**']}).map(file => [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

const scssFiles = Object.fromEntries(
  globSync('src/scss/**/*.scss', { ignore: ['src/scss/**/_*.scss'] }).map(file => [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

const ejsFiles = Object.fromEntries(
  globSync('src/ejs/**/*.ejs', { ignore: ['node_modules/**', '**/dist/**',] })
    .filter(file => !path.basename(file).startsWith('_')) // アンダーバーが先頭のファイルを除外
    .map(file => [
    path.relative(
      'src/ejs',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

// 出力ディレクトリ
const outputDir = path.resolve('dist');

// HTMLコンパイルと書き出し
(async () => {
  try {
    for (const [relativePath, filePath] of Object.entries(ejsFiles)) {
      // EJSファイルを読み込む
      const template = await fs.readFile(filePath, 'utf-8');

      // EJSテンプレートをHTMLにコンパイル
      const html = ejs.render(template, {
        // EJS内で使う変数をここに設定
        basePath: '',
        head: {
          noindex: false,
          title: 'test',
          desc: 'test desc',
        },
      }, {
        // includeのベースディレクトリを指定
        root: path.resolve('src/ejs'),
        filename: filePath, // 現在のテンプレートのパスを渡す
      });

      // 出力先のファイルパスを決定
      const outputPath = path.join(outputDir, `${relativePath}.html`);

      // 出力先ディレクトリを作成
      await fs.ensureDir(path.dirname(outputPath));

      // HTMLファイルを書き込む
      await fs.writeFile(outputPath, html, 'utf-8');

      console.log(`Generated: ${outputPath}`);
    }

    console.log('All files have been compiled and saved to the dist directory.');
  } catch (error) {
    console.error('Error during compilation:', error);
  }
})();


const inputObject = { ...scssFiles, ...jsFiles, ...fontFiles, ...ejsFiles };

const fontFileNames = (assetInfo) => {
  if (/\.woff2?$/.test(assetInfo.name)) {
    return 'assets/fonts/[name].[ext]';
  }
  return 'assets/[name].[ext]';
};

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: inputObject,
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: (assetInfo) => {
          if (/\.( gif|jpeg|jpg|png|svg|webp| )$/.test(assetInfo.name)) {
            return 'assets/images/[name].[ext]';
          }
          if (/\.css$/.test(assetInfo.name)) {
            return 'assets/css/style.css';
          }
          if (/\.ttf?$/.test(assetInfo.name)) {
            return 'assets/fonts/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        },
      },
    },
    emptyOutDir: true,
    assetsDir: 'assets',
    minify: false,
  },
  plugins: [
    ViteEjsPlugin({
      basePath: '',
      head: {
        title: '',
        desc: '',
      },
    }),
    viteImagemin({
      mozjpeg: {
        quality: 80,
      },
      svgo: {
        plugins: [
          {
            removeViewBox: false,
          },
        ],
      },
    }),
  ],
  assetsInclude: ['**/*.ejs'],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "Foundation/index" as *;`,
      },
    },
    postcss: {
      plugins: [
        postcssPresetEnv(),
        autoprefixer(),
        // cssnano({
        //   preset: ['default', {
        //     discardComments: { removeAll: false } // コメントを保持
        //   }],
        // }),
      ],
    },
  },
  server: {
    port: 3000
  }
});


