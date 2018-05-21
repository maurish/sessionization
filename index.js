const fs = require('fs');
const sessionizer = require('./src/sessionizer');

const run = async (stream) => {
  const response = await sessionizer.sessionize(stream);
  fs.writeFile('result.json', JSON.stringify(response, null, 2), (err, res) => {})
}

run(process.stdin);
