const R = require('ramda');
module.exports = (_, record) => R.merge(record, {
  state: 'closed'
});
