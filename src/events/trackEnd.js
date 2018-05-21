const R = require('ramda');
module.exports = ({user_id, content_id, timestamp}, record) => R.merge(record, {
  state: 'open/end',
});
