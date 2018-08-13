'use strict';

// There is a new file every Sunday and Wednesday
function getRadioDate() {
  // Find the date for previous Sunday
  var prevSunday = new Date();
  prevSunday.setDate(prevSunday.getDate() - (prevSunday.getDay() + 7));

  // Find the date for previous Wednesday
  var prevWednesday = new Date();
  prevWednesday.setDate(prevWednesday.getDate() - (prevWednesday.getDay() + 4));

  // Which one is newer?
  var d = new Date(Math.max(prevWednesday, prevSunday));

  // Create a date in the format ddmmyy1
  var datestring = ("0" + d.getDate()).slice(-2) + ("0"+(d.getMonth()+1)).slice(-2) +
  (d.getFullYear() - 2000) + "1";

  return (datestring);
}


var audioData = [
    {
        // Station Name - Displayed on card in Alexa App
        'title' : 'Shabbat Ivrit Radio',
        // URL to Live Stream - Should be HTTPS, if not, reach out to your BD/SA contact for assistance
        //'url' : 'https://103fm.live.streamgates.net/103fm_live/1multix/icecast.audio',
        'url' : 'https://103fm_aod_main.streamgates.net/103fm_aod/sub' + getRadioDate() + '.mp3',
        // URL to Station Logo - Should be HTTPS, S3 works great
        'image' : 'https://s3.amazonaws.com/shabbat-ivrit-skill/radio-103fm.png'
    }
];

module.exports = audioData;
