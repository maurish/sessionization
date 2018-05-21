const Lazy = require('lazy');
const R = require('ramda');
const events = require('./events');
const { mapPath } = require('./utils');

const step = (event, acc) => {
  const handler = events(event.event_type);
  return mapPath([event.user_id, event.content_id], handler(event), acc);
};

const run = (stream) => new Promise((resolve) =>
  Lazy(stream)
    .lines
    .map(buffer => buffer.toString())
    .map(string => JSON.parse(string))
    .foldr(step, {}, response => resolve(
      R.pipe(
        R.values,
        R.map(R.values),
        R.flatten,
        R.filter(R.propEq('state', 'closed')),
        R.map(R.omit(['state']))
      )(response)
    ))
);


module.exports.sessionize = run;
