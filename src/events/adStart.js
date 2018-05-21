const R = require('ramda');
module.exports = (_, record) => R.merge(record, {
  ad_count: record.ad_count + 1,
  state: 'open/ad',
});
