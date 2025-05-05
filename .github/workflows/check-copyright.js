const fs = require('fs');
const { processFile } = require('./process-file');
const year = new Date().getFullYear();

// Header block to insert/replace
const newHeaderBlock = [
  '/**',
  ` * Copyright (c) ${year} Chaitanya Babar`,
  ' * Licensed under the MIT License. See LICENSE file in the project root for full license information. ',
  ' */',
  '',
];
const targetExts = ['.js', '.ts']; // Add the targetExts.


const changedFilesPath = process.argv[2];
if (!changedFilesPath || !fs.existsSync(changedFilesPath)) {
  console.error('Changed files list not found.');
  process.exit(0);
}

const changedFiles = fs.readFileSync(changedFilesPath, 'utf-8')
  .split('\n')
  .map(f => f.trim())
  .filter(f => f && (f.endsWith('.ts') || f.endsWith('.js')) && fs.existsSync(f));

let missing = [];

changedFiles.forEach((filePath) => {
  if(processFile(filePath, targetExts, newHeaderBlock)){
    console.warn(`Missing copyright in: ${filePath}`);
    missing.push(filePath);
  }
});


if (missing.length > 0) {
  console.error(`❌ Found ${missing.length} files without copyright headers.`);
  process.exit(1);
} else {
  console.log(`✅ All checked files have copyright headers.`);
}
