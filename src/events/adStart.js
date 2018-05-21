const R = require('ramda');
module.exports = (e, record) => R.over(R.lensProp('ad_count'), R.add(1), record);
