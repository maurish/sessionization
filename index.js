const sessionizer = require('./src/sessionizer');

const run = async (stream) => {
  const response = await sessionizer.sessionize(stream);
  response
    .map(record => JSON.stringify(record, null, 2) + '\n')
    .forEach(string => process.stdout.write(string));
}

run(process.stdin);
