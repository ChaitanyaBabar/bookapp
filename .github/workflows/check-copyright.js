const fs = require('fs');
const glob = require('glob');

const files = glob.sync('server/**/*.js');
let missing = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('Copyright (c)')) {
    missing.push(file);
  }
});

if (missing.length > 0) {
  console.log(`❌ Missing copyright in: ${missing.join(', ')}`);
  // Expose output to GitHub Actions
  console.log(`::set-output name=copyright_missing::true`);
} else {
  console.log('✅ All files have copyright headers');
  console.log(`::set-output name=copyright_missing::false`);
}
