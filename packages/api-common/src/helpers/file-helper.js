// Vendor libs
const fs = require('fs');

function parseJSONFile(filePath) {
  const rawdata = fs.readFileSync(filePath, 'utf8');
  const result = JSON.parse(rawdata);
  return result;
}

// Exportation
module.exports = {
  parseJSONFile
};
