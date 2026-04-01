const fs = require('fs');

const path = './index.html';
let content = fs.readFileSync(path, 'utf8');

const regexWithSpace = /(🎂|🏢|🎓|📋|📞|✉️|📍|🕐|🥖|🧀|🥤|🎉)\s/g;
const regexWithoutSpace = /(🎂|🏢|🎓|📋|📞|✉️|📍|🕐|🥖|🧀|🥤|🎉)/g;

content = content.replace(regexWithSpace, '');
content = content.replace(regexWithoutSpace, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Emojis removed');
