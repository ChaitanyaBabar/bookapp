const fs = require('fs');
const glob = require('glob');
const path = require('path');

const targetDir = 'server/backend';
const targetExts = ['.js', '.ts']; // Add the targetExts.
const year = new Date().getFullYear();
const author = 'Chaitanya Babar';

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
  const ext = path.extname(filePath);
  if (!targetExts.includes(ext)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Scan top 20 lines but only count 10 meaningful lines
  let startIdx = -1;
  let endIdx = -1;
  let checkedLines = 0;

  for (let i = 0; i < lines.length && checkedLines < 10 && i < 20; i++) {
    const trimmed = lines[i].trim();

    if (!trimmed || trimmed === '//' || trimmed === '/*' || trimmed === '*/') continue;

    checkedLines++;

    if (trimmed.includes('Copyright (c)')) {
      // Found copyright line
      startIdx = i;

      // Go upward to find block start
      while (startIdx > 0 && !lines[startIdx].trim().startsWith('/*')) {
        startIdx--;
      }

      // Go downward to find block end
      endIdx = i;
      while (endIdx < lines.length && !lines[endIdx].includes('*/')) {
        endIdx++;
      }

      break;
    }
  }

  if (startIdx !== -1 && endIdx !== -1) {
    // Replace existing block
    lines.splice(startIdx, endIdx - startIdx + 1, ...newHeaderBlock);
    console.log(`🔁 Updated copyright in: ${filePath}`);
  } else {
    // Add at top
    lines.unshift(...newHeaderBlock);
    console.log(`➕ Added copyright in: ${filePath}`);
  }

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
});
