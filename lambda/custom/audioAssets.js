'use strict';
const scrape = require('./scrapeEpisodes');

var audioData, callback;

scrape.scrapeEpisodes((res) => {
  audioData = res.map((i) => {
    var parts = i.date.split('/');
    var date = new Date(parts[2], parts[1] - 1, parts[0]);
    return {'title' : 'Shabbat Ivrit Radio ' + date.toDateString() + ' ' + i.title,
            'url' : i.episodeUri,
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
