// Vendor libs
const fs = require('fs');

module.exports = filePath => {
  // Verify argument
  if (!filePath) {
    throw new Error(`Argument "filePath" in method utils/loadJson is null`);
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `File with path ${filePath} not exists (method utils/loadJson)`
    );
  }

  // Try read file
  let rawData = null;

  try {
    rawData = fs.readFileSync(filePath);
  } catch (err) {
    throw new Error(
      `Error trying read file ${filePath} (method utils/loadJson)`,
      err
    );
  }

  if (!rawData || rawData.length === 0) {
    throw new Error(
      `File with path ${filePath} is empty (method utils/loadJson)`
    );
  }

  try {
    return JSON.parse(rawData);
  } catch (err) {
    throw new Error(
      `Error trying read and parse file ${filePath} (method utils/loadJson)`,
      err
    );
  }
};
