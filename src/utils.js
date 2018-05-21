const R = require('ramda');
module.exports.mapPath = R.curry((path, f, obj) =>
  R.assocPath(path, f(R.path(path, obj)), obj)
);
