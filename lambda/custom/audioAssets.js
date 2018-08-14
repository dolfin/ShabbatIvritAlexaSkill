'use strict';
const scrape = require('./scrapeEpisodes');

function formatDate(date) {
  return ("0" + date.getDate()).slice(-2) + ("0"+(date.getMonth()+1)).slice(-2) +
  (date.getFullYear() - 2000);
}

var audioData, callback;

scrape.scrapeEpisodes((res) => {
  audioData = res.map((i) => {
    var parts = i.date.split('/');
    var date = new Date(parts[2], parts[1] - 1, parts[0]);
    return {'title' : 'Shabbat Ivrit Radio ' + date.toDateString() + ' ' + i.title,
            'url' : 'https://103fm_aod_main.streamgates.net/103fm_aod/sub' + formatDate(date) + '1.mp3',
            'image' : i.image};
  });

  if (typeof callback == 'function') {
    callback(audioData);
  }
});

module.exports = function(cb) {
  if (typeof audioData != 'undefined') {
    cb(audioData); // If audioData is already define, I don't wait.
  } else {
    callback = cb;
  }
}
