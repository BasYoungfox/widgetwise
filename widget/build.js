const esbuild = require('esbuild');

esbuild.buildSync({
  entryPoints: ['widget.js'],
  bundle: true,
  minify: true,
  outfile: 'dist/widget.min.js',
  format: 'iife',
  target: ['es2018'],
});

console.log('Widget built → dist/widget.min.js');
