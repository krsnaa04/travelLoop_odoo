const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== 'dist') {
        walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  });
}

function replaceColors() {
  walkDir(path.join(__dirname, 'frontend'), (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Convert light mode tailwind text colors to dark mode
    content = content.replace(/text-slate-900/g, 'text-slate-100');
    content = content.replace(/text-slate-800/g, 'text-slate-200');
    content = content.replace(/text-slate-700/g, 'text-slate-300');
    content = content.replace(/text-slate-600/g, 'text-slate-400');
    content = content.replace(/text-gray-900/g, 'text-gray-100');
    content = content.replace(/text-gray-800/g, 'text-gray-200');
    content = content.replace(/text-black/g, 'text-white');
    content = content.replace(/bg-white/g, 'bg-slate-900');
    content = content.replace(/bg-slate-100/g, 'bg-slate-800');
    content = content.replace(/bg-slate-50/g, 'bg-slate-900/50');
    content = content.replace(/bg-gray-100/g, 'bg-gray-800');
    content = content.replace(/border-black/g, 'border-white');
    content = content.replace(/border-slate-200/g, 'border-slate-800');
    content = content.replace(/border-slate-300/g, 'border-slate-700');
    content = content.replace(/border-gray-200/g, 'border-gray-800');
    
    // Replace placeholder images
    content = content.replace(/\/avatar-placeholder\.png/g, 'https://i.pravatar.cc/150');
    content = content.replace(/\/placeholder-trip\.jpg/g, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated:', filePath);
    }
  });
}

replaceColors();
