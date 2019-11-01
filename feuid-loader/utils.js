const fs = require('fs');
const path = require('path');

function getSpecifiedFile(filename) {
  const whiteList = ['.vue'];
  if (whiteList.indexOf(path.extname(filename)) === -1) {
    return;
  }
  fs.readFile(filename, 'utf-8', (err, source) => {
    if (err) {
      return err;
    }
    const result = parseHTML(source);
    fs.writeFile(filename, result, 'utf8', function (err) {
      if (err) {
        return err;
      };
    });
  });
}

function parseHTML(source) {
  //<> </>等的正则匹配
  const tagRegex = /<(\/)?([^\/<>]+)(\/)?>/g;
  let regexResult;
  let isLoopTag = true;
  let result = source;
  while (isLoopTag && (regexResult = tagRegex.exec(result))) {
    const isEnd = !!regexResult[1];
    const tag = regexResult[2].split(' ')[0];
    if (isEnd && tag === 'template') {
      isLoopTag = false;
    } else if (!isEnd && tag !== 'template') {
      const key = 'data-testid';
      if (regexResult[2].indexOf(key) === -1) {
        const tagLength = regexResult[2].length; 
        const attr = `${key}=${generateUuid()}`;
        const index = regexResult.index + tagLength + 1;
        result = `${result.slice(0, index)} ${attr}${result.slice(index, result.length + 1 )}`
      }
    }
  }
  return result;
}

function generateUuid() {
  return +new Date();
}

module.exports = function travelDir (dir) {
  fs.readdirSync(dir).forEach(function (file) {
    const pathname = path.join(dir, file);

    if (fs.statSync(pathname).isDirectory()) {
      travelDir(pathname);
    } else {
      getSpecifiedFile(pathname);
    }
  });
}
