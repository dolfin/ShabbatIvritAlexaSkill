const constants = require('./constants');
const rp = require('request-promise');
const cheerio = require('cheerio');

var scrape = {};

const options = {
  uri: constants.scrapeUrl,
  transform: function (body) {
    return cheerio.load(body);
  }
};

scrape.scrapeEpisodes = function(callback) {
  const episodes = [];

  rp(options)
    .then(($) => {
      $('.grid a').each(function(i, elem) {
          var title = $(this).find('.segment_title').text();
          var date = $(this).find('.segment_date_txt').text();
          var img = $(this).find('.segment_picture img').attr('src');
          episodes[i] = {'title' : title, 'date' : date, 'image' : img};
        });
      episodes.join();
      callback(episodes);
    })
    .catch((err) => {
      console.log(err);
      callback(episodes);
    });
};

module.exports = scrape;
