const constants = require('./constants');
const rp = require('request-promise');
const cheerio = require('cheerio');

var scrape = {};

scrape.scrapeEpisodes = function(callback) {
  const options = {
    uri: constants.scrapeUrl,
    transform: function (body) {
      return cheerio.load(body);
    }
  };

  rp(options)
    .then(($) => {
      const episodes = [];
      $('.grid a').each(function(i, elem) {
          var url = $(this).attr('href');
          var title = $(this).find('.segment_title').text();
          var date = $(this).find('.segment_date_txt').text();
          var img = $(this).find('.segment_picture img').attr('src');
          var combinedUri = constants.scrapeEpisodePrefix + encodeURI(url);
          episodes[i] = {'title' : title, 'date' : date, 'image' : img, 'episodeUri' : combinedUri};
        });
      episodes.join();
      callback(episodes);
    })
    .catch((err) => {
      console.log(err);
      callback([]);
    });
};

scrape.scrapeMediaFile = function(url, callback) {
  file = '';

  const mediaOptions = {
    uri: url,
    transform: function (body) {
      return cheerio.load(body);
    }
  };

  rp(mediaOptions)
    .then(($) => {
      file = $('.mouthjs-autoplay').attr('data-file');
      callback(file);
    })
    .catch((err) => {
      console.log(err);
      callback(file);
    });
};

module.exports = scrape;
