
const glob = require('glob');
const { processFile } = require('./process-file');

const targetDir = 'server/backend';
const targetExts = ['.js', '.ts']; // Add the targetExts.
const year = new Date().getFullYear();


// Header block to insert/replace
const newHeaderBlock = [
  '/**',
  ` * Copyright (c) ${year} Chaitanya Babar`,
  ' * Licensed under the MIT License. See LICENSE file in the project root for full license information. ',
  ' */',
  '',
];


// Find all files recursively
const files = glob.sync(`${targetDir}/**/*`, { nodir: true });

files.forEach((filePath) => {
  processFile(filePath, targetExts, newHeaderBlock);
});
