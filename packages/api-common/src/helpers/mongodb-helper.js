// Vendor libs
const fs = require('fs');
const { EJSON } = require('bson');

function parseBSONFile(filePath) {
  const rawdata = fs.readFileSync(filePath, 'utf8');
  const arrayData = rawdata.split('\n');

  const result = [];

  arrayData.forEach(data => {
    if (data) {
      const x = EJSON.parse(data);
      const y = JSON.stringify(x);
      const z = JSON.parse(y);
      result.push(z);
    }
  });

  return result;
}

// Exportation
module.exports = {
  parseBSONFile
};
