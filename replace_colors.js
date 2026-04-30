import fs from 'fs';
import path from 'path';

const REPLACEMENTS = [
  { search: /#e8f0fe/gi, replace: '#e0f4ee' },
  { search: /#0a2540/gi, replace: '#073b3a' },
  { search: /#2563eb/gi, replace: '#073b3a' },
  { search: /#d2e3fc/gi, replace: '#ccebe1' },
  { search: /#bfdbfe/gi, replace: '#b8e3d6' },
  // Also fix rgb values for swiper overriding in globals.css
  { search: /rgba\(37,\s*99,\s*235/g, replace: 'rgba(7, 59, 58' },
  { search: /rgba\(10,\s*37,\s*64/g, replace: 'rgba(7, 59, 58' },
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const r of REPLACEMENTS) {
        if (content.match(r.search)) {
          content = content.replace(r.search, r.replace);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(process.cwd(), 'src'));
console.log('Done replacing colors.');
