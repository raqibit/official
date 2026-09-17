const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (!filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // The premium 15px body style
  const PREMIUM_STYLE = 'text-[15px] text-gray-500 leading-[1.7]';
  const PREMIUM_STYLE_ZINC = 'text-[15px] text-zinc-400 leading-[1.7]';
  const PREMIUM_STYLE_WHITE = 'text-[15px] text-white leading-[1.7]';
  const PREMIUM_STYLE_GRAY_600 = 'text-[15px] text-gray-600 leading-[1.7]';
  
  // Replace standard body classes with the new 15px premium style
  content = content.replace(/text-sm text-gray-500 leading-relaxed/g, PREMIUM_STYLE);
  content = content.replace(/text-gray-500 text-sm leading-relaxed/g, PREMIUM_STYLE);
  content = content.replace(/text-sm text-gray-600 leading-relaxed/g, PREMIUM_STYLE_GRAY_600);
  content = content.replace(/text-sm text-zinc-400 leading-relaxed/g, PREMIUM_STYLE_ZINC);
  content = content.replace(/text-zinc-400 text-sm leading-relaxed/g, PREMIUM_STYLE_ZINC);

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
});
