const path = require('path');
const fs = require('fs');

function processFile(filePath, targetExts, newHeaderBlock) {
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
}


module.exports = { processFile };
