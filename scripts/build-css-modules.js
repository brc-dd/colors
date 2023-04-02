const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const allColorScales = require('../index');

const outputDir = require('../tsconfig.json').compilerOptions.outDir;
const output = {};

Object.entries(allColorScales).forEach(([colorScaleName, scale]) => {
  const selector = /DarkA?$/.test(colorScaleName) ? '.dark' : ':root';
  const scaleAssCssProperties = Object.entries(scale)
    .map(([name, value]) => `--${name}: ${value};`)
    .join('\n');
  output[selector] = (output[selector] || '') + scaleAssCssProperties;
});

postcss([require('cssnano')({ preset: 'default' })])
  .process(`:root{${output[':root']}}\n.dark{${output['.dark']}}`, {
    from: undefined
  })
  .then((result) => {
    fs.writeFileSync(path.join(outputDir, 'index.min.css'), result.css);
  });
