
const glob = require('glob');
const { addUpdateCopyRight } = require('./add-update-copyright');

const targetDir = 'server/backend';
const targetExts = ['.js', '.ts']; // Add the targetExts.
const year = new Date().getFullYear();


// Header block to insert/replace
const newHeaderBlock = [
  '/**',
  ` * Copyright (c) ${year} Chaitanya Babar`,
  ' * Licensed under the MIT License. See LICENSE file in the project root for full license information. (cbabar) Updated Copyright 1 ',
  ' */',
  '',
];


// Find all files recursively
const files = glob.sync(`${targetDir}/**/*`, { nodir: true });

files.forEach((filePath) => {
  addUpdateCopyRight(filePath, targetExts, newHeaderBlock);
});

// TODO : This line can be deleted. Dummy unrelated change in master Batch 2
