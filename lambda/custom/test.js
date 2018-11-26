'use strict';

const scrape = require('./scrapeEpisodes');
var constants = require('./constants');

var audioData;

scrape.scrapeEpisodes((res) => {
  audioData = res.map((i) => {
    var parts = i.date.split('/');
    var date = new Date(parts[2], parts[1] - 1, parts[0]);
    return {'title' : 'Shabbat Ivrit Radio ' + date.toDateString() + ' ' + i.title,
              'url' : i.episodeUri,
              'image' : i.image};
  });

  console.log(audioData);

  scrape.scrapeMediaFile(audioData[0].url, mf => {
    var mfurl = constants.mediaPrefix + mf + constants.mediaSuffix;
    console.log(mfurl);
  });
});
