const fs = require('fs');
const glob = require('glob');
const path = require('path');

const targetDir = 'server/backend';
const targetExts = ['.js', '.ts']; // You can extend to .ts if needed

// Get the current year dynamically
const year = new Date().getFullYear();

// Define the copyright header dynamically
const header = `/**
 * Copyright (c) ${year} Chaitanya Babar (cbabar)
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */\n\n`;

const files = glob.sync(`${targetDir}/**/*`, { ignore: ['node_modules/**', 'dist/**', 'build/**', '**/*.d.ts'] });

files.forEach((filePath) => {
  const ext = path.extname(filePath);
  if (!targetExts.includes(ext)) return;

  let content = fs.readFileSync(filePath, 'utf8').trimStart();
  const lines = content.split('\n');

  // Check if the first line already contains a copyright
  const hasCopyright = lines[0].includes('Copyright (c)');

  if (hasCopyright) {
    // Replace old copyright with new one
    lines[0] = header;
    console.log(`🔁 Updated copyright in: ${filePath}`);
  } else {
    // Insert at top
    lines.unshift(header, '');
    console.log(`➕ Added copyright in: ${filePath}`);
  }

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
});
