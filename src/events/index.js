const R = require('ramda');
const { mapPath } = require('../utils');
const { timeoutInSeconds } = require('../../config.json');

const noop = (e, acc) => acc;

const events = {
  stream_start: require('./streamStart'),
  ad_start: require('./adStart'),
  ad_end: require('./adEnd'),
  track_start: require('./trackStart'),
  track_end: require('./trackEnd'),
  track_hearbeat: noop, // typo in dataset2.json
  track_heartbeat: noop,
  pause: require('./pause'),
  play: require('./play'),
  stream_end: require('./streamEnd')
};

module.exports = eventType => {
  const handler = events[eventType];
  if (!handler){
    throw `Unrecognized event type ${eventType}`;
  }
  return R.curryN(2, (e, acc = []) => {

    const last = R.last(acc);
    const timeout = R.prop('session_end', last) < e.timestamp - timeoutInSeconds;
    if (timeout) {
      acc = R.set(R.lensPath([acc.length - 1, 'state']), 'closed', acc)
    }

    const newRecord = acc.length === 0 ||
      e.eventType === 'stream_start' ||
      timeout ||
      R.prop('state', last) === 'closed';


    const record = R.pipe(
      acc => newRecord ? defaultObject(e) : R.last(acc),
      record => R.merge(record, {
        session_end: e.timestamp,
        event_count: record.event_count + 1,
        total_time: e.timestamp - record.session_start,
        track_playtime: record.track_playtime + (record.state === 'open/playing' ? (e.timestamp - record.session_end) : 0)
      }),
      record => handler(e, record)
    )(acc);
    
    if (newRecord) {
      return R.append(record, acc);
    }
    return R.update(acc.length - 1, record, acc);
  });
};


const updateRecord = (e, record) => R.merge(record, {
  session_end: e.timestamp,
  event_count: record.event_count + 1,
  total_time: e.timestamp - record.session_start
});

const defaultObject = e => ({
  user_id: e.user_id,
  content_id: e.content_id,
  state: 'open',
  ad_count: 0,
  track_playtime: 0,
  total_time: 0,
  session_end: e.timestamp,
  session_start: e.timestamp,
  event_count: 0
});
