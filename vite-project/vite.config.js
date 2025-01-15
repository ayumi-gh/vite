import { defineConfig } from 'vite';
import { ViteEjsPlugin } from "vite-plugin-ejs";
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import viteImagemin from 'vite-plugin-imagemin';
import { globSync } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const jsFiles = Object.fromEntries(
  globSync('src/**/*.js', { ignore: ['node_modules/**','**/modules/**','**/dist/**']}).map(file => [
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

const htmlFiles = Object.fromEntries(
  globSync('src/**/*.html', { ignore: ['node_modules/**', '**/dist/**'] }).map(file => [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

const fontFiles = Object.fromEntries(
  globSync('src/fonts/**/*.ttf').map(file => [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

const inputObject = { ...scssFiles, ...jsFiles, ...htmlFiles, ...fontFiles };

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
            return 'assets/css/[name].[ext]';
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
    ViteEjsPlugin ({ 
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
        cssnano({
          preset: ['default', {
            discardComments: { removeAll: false } // コメントを保持
          }],
        }),
      ],
    },
  },
  server: {
    port: 3000
  }
});
