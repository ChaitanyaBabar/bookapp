const fs = require('fs');
const glob = require('glob');

// 🔥 Get the current year dynamically
const year = new Date().getFullYear();

// 📜 Define the copyright header dynamically
const header = `/**
 * Copyright (c) ${year} Chaitanya Babar
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */\n\n`;

const files = glob.sync('server/backend/**/*.{js,ts}', {
  ignore: ['node_modules/**', 'dist/**', 'build/**', '**/*.d.ts']
});

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('Copyright (c)')) {
    fs.writeFileSync(file, header + content);
    console.log(`✅ Header added to ${file}`);
  }
});
