import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirPath = path.join(__dirname, 'src/assets/whatsnew-files');
const jsonPath = path.join(__dirname, 'src/assets/json/whatsnew-files.json');

//==============
//RENAMING FILES
//==============

let files = fs.readdirSync(dirPath);

files.forEach(file => {

    const newName = file.trim().replace(/\s+/g, '_');

    if (file !== newName) {
        const oldPath = path.join(dirPath, file);
        const newPath = path.join(dirPath, newName);

        fs.renameSync(oldPath, newPath);
    }
});

//==========
//SORT FILES
//==========

files = fs.readdirSync(dirPath);

const sorted = [...files].sort((b, a) => {

    const getVersion = str => {
        const match = str.match(/\d+(\.\d+)*/);
        return match ? match[0] : "0";
    };

    const vA = getVersion(a).split('.').map(Number);
    const vB = getVersion(b).split('.').map(Number);

    const maxLength = Math.max(vA.length, vB.length);

    for (let i = 0; i < maxLength; i++) {
        const numA = vA[i] || 0;
        const numB = vB[i] || 0;

        if (numA !== numB) {
            return numA - numB;
        }
    }

    return 0;
});

//============
//WRITING JSON
//============

fs.writeFileSync(jsonPath, JSON.stringify(sorted));

console.log(sorted);