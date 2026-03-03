const fs = require('fs');
const path = require('path');

function replaceImageInFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('dist')) {
                replaceImageInFiles(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('mission_3.png')) {
                content = content.replace(/mission_3\.png/g, 'mission_worship_new.jpg');
                fs.writeFileSync(fullPath, content, 'utf8');
            }
        }
    }
}

replaceImageInFiles(__dirname);
console.log('Replaced mission_3.png with mission_worship_new.jpg');
