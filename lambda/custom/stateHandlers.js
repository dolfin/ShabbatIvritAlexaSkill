'use strict';

var Alexa = require('alexa-sdk');
var constants = require('./constants');
var audioData = require('./audioAssets');
var scrape = require('./scrapeEpisodes');

var stateHandlers = {


    startModeIntentHandlers : Alexa.CreateStateHandler(constants.states.START_MODE, {
        /*
         *  All Intent Handlers for state : START_MODE
         */
        'LaunchRequest' : function () {
            console.log('LaunchRequest - startModeIntentHandlers');

            // Initialize Attributes
            this.attributes['index'] = 0;
            this.attributes['offsetInMilliseconds'] = 0;
            this.attributes['loop'] = true;
            this.attributes['shuffle'] = false;
            this.attributes['playbackIndexChanged'] = true;
            this.attributes['state'] = 'START_MODE';
            //  Change state to START_MODE

            this.handler.state = constants.states.START_MODE;

            var thiz = this;
            audioData(function(ad) {
              thiz.attributes['playOrder'] = Array.apply(null, {length: ad.length}).map(Number.call, Number);
              thiz.emit('PlayRadio');
            });
        },
        'PlayRadio' : function () {
            console.log('PlayRadio - playModeIntentHandler');

            controller.play.call(this);
        },
        'AMAZON.HelpIntent' : function () {
            var message = 'Sample of a live radio station playback.';
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        },
        'AMAZON.StopIntent' : function () {
            var message = 'Good bye.';
            this.response.speak(message);
            this.emit(':responseReady');
        },
        'AMAZON.CancelIntent' : function () {
            var message = 'Good bye.';
            this.response.speak(message);
            this.emit(':responseReady');
        },
        'SessionEndedRequest' : function () {
            // No session ended logic
        },
        'Unhandled' : function () {
            var message = 'Sorry, I could not understand.';
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        }
    }),

    playModeIntentHandlers : Alexa.CreateStateHandler(constants.states.PLAY_MODE, {
        /*
         *  All Intent Handlers for state : PLAY_MODE
         */
        'LaunchRequest' : function () {
            console.log('LaunchRequest - playModeIntentHandlers');
            this.emit('PlayRadio');
        },
        'PlayRadio' : function () {
            console.log('PlayRadio - playModeIntentHandler');
            controller.play.call(this);
        },
        'AMAZON.NextIntent' : function () { controller.playNext.call(this) },
        'AMAZON.PreviousIntent' : function () { controller.playPrevious.call(this) },
        'AMAZON.PauseIntent' : function () { controller.stop.call(this) },
        'AMAZON.StopIntent' : function () { controller.stop.call(this) },
        'AMAZON.CancelIntent' : function () { controller.stop.call(this) },
        'AMAZON.ResumeIntent' : function () { controller.play.call(this) },
        'AMAZON.LoopOnIntent' : function () { controller.loopOn.call(this) },
        'AMAZON.LoopOffIntent' : function () { controller.loopOff.call(this) },
        'AMAZON.ShuffleOnIntent' : function () { controller.shuffleOn.call(this) },
        'AMAZON.ShuffleOffIntent' : function () { controller.shuffleOff.call(this) },
        'AMAZON.StartOverIntent' : function () { controller.startOver.call(this) },
        'AMAZON.HelpIntent' : function () {
            var message = 'Sample of a live radio station playback.';
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        },
        'SessionEndedRequest' : function () {
            // No session ended logic
        },
        'Unhandled' : function () {
            var message = 'Sorry, I could not understand.';
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        }
    }),


    remoteControllerHandlers : Alexa.CreateStateHandler(constants.states.PLAY_MODE, {
        /*
         *  All Requests are received using a Remote Control. Calling corresponding handlers for each of them.
         */
        'PlayCommandIssued' : function () { controller.play.call(this) },
        'PauseCommandIssued' : function () { controller.stop.call(this) },
        'NextCommandIssued' : function () { controller.playNext.call(this) },
        'PreviousCommandIssued' : function () { controller.playPrevious.call(this) }
    })


};

module.exports = stateHandlers;

var controller = function () {
    return {
        play: function () {
            /*
             *  Using the function to begin playing audio when:
             *      Play Audio intent invoked.
             *      Resuming audio when stopped/paused.
             *      Next/Previous commands issued.
             */
            this.handler.state = constants.states.PLAY_MODE;

            if (this.attributes['playbackFinished']) {
                // Reset to top of the playlist when reached end.
                this.attributes['index'] = 0;
                this.attributes['offsetInMilliseconds'] = 0;
                this.attributes['playbackIndexChanged'] = true;
                this.attributes['playbackFinished'] = false;
            }

            var thiz = this;
            audioData(function(ad) {
              var token = String(thiz.attributes['playOrder'][thiz.attributes['index']]);
              var playBehavior = 'REPLACE_ALL';
              var podcast = ad[thiz.attributes['playOrder'][thiz.attributes['index']]];
              var podcastUrl = thiz.attributes['podcastUrl'];
              var offsetInMilliseconds = thiz.attributes['offsetInMilliseconds'];
              // Since play behavior is REPLACE_ALL, enqueuedToken attribute need to be set to null.
              thiz.attributes['enqueuedToken'] = null;

              if (podcast.url !== podcastUrl) {
                offsetInMilliseconds = 0;
                thiz.attributes['offsetInMilliseconds'] = 0;
              }

              if (thiz.event.request.type.substring(0,11) === 'AudioPlayer') {
                  var cardTitle = 'Playing ' + podcast.title;
                  var cardContent = 'Playing ' + podcast.title;
                  var cardImage = {
                          "smallImageUrl": podcast.image,
                          "largeImageUrl": podcast.image
                      };
                  thiz.response.cardRenderer(cardTitle, cardContent, cardImage);
              }

              if (thiz.event.request.type === 'LaunchRequest' || thiz.event.request.type === 'IntentRequest') {
                  var cardTitle = 'Playing ' + podcast.title;
                  var cardContent = 'Playing ' + podcast.title;
                  var cardImage = {
                          "smallImageUrl": podcast.image,
                          "largeImageUrl": podcast.image
                      };
                  thiz.response.cardRenderer(cardTitle, cardContent, cardImage);

                  var message = "Playing " + podcast.title;
                  thiz.response.speak(message);
              }

              scrape.scrapeMediaFile(podcast.url, mf => {
                var mfurl = constants.mediaPrefix + mf + constants.mediaSuffix;
                thiz.response.audioPlayerPlay(playBehavior, mfurl, token, null, offsetInMilliseconds);
                thiz.emit(':responseReady');
              });
            });
        },
        stop: function () {
            /*
             *  Issuing AudioPlayer.Stop directive to stop the audio.
             *  Attributes already stored when AudioPlayer.Stopped request received.
             */

            this.response.audioPlayerStop();
            this.emit(':responseReady');
        },
        playNext: function () {
            if (this.event.request.type === 'IntentRequest') {
              // Jump to next episode
              this.attributes['index'] = this.attributes['index'] + 1;
              if (this.attributes['index'] >= this.attributes['playOrder'].length) {
                this.attributes['index'] = 0;
              }
              this.attributes['offsetInMilliseconds'] = 0;
              this.attributes['playbackIndexChanged'] = true;
              controller.play.call(this);
            }
        },
        playPrevious: function () {
          if (this.event.request.type === 'IntentRequest') {
            // Jump to next episode
            this.attributes['index'] = this.attributes['index'] - 1;
            if (this.attributes['index'] < 0) {
              this.attributes['index'] = this.attributes['playOrder'].length - 1;
            }
            this.attributes['offsetInMilliseconds'] = 0;
            this.attributes['playbackIndexChanged'] = true;
            controller.play.call(this);
          }
        },
        loopOn: function () {
            // Turn on loop play.
            this.attributes['loop'] = true;
            var message = 'Loop turned on.';
            this.response.speak(message);
            this.emit(':responseReady');
        },
        loopOff: function () {
            // Turn off looping
            this.attributes['loop'] = false;
            var message = 'Loop turned off.';
            this.response.speak(message);
            this.emit(':responseReady');
        },
        shuffleOn: function () {
            // Turn on shuffle play.
            this.attributes['shuffle'] = true;
            shuffleOrder((newOrder) => {
                // Play order have been shuffled. Re-initializing indices and playing first song in shuffled order.
                this.attributes['playOrder'] = newOrder;
                this.attributes['index'] = 0;
                this.attributes['offsetInMilliseconds'] = 0;
                this.attributes['playbackIndexChanged'] = true;
                controller.play.call(this);
            });
        },
        shuffleOff: function () {
            var thiz = this;
            audioData(function(ad) {
              // Turn off shuffle play.
              if (thiz.attributes['shuffle']) {
                  thiz.attributes['shuffle'] = false;
                  // Although changing index, no change in audio file being played as the change is to account for reordering playOrder
                  thiz.attributes['index'] = thiz.attributes['playOrder'][thiz.attributes['index']];
                  thiz.attributes['playOrder'] = Array.apply(null, {length: ad.length}).map(Number.call, Number);
              }
              controller.play.call(thiz);
            });
        },
        startOver: function () {
            // Start over the current audio file.
            this.attributes['offsetInMilliseconds'] = 0;
            controller.play.call(this);
        },
        reset: function () {
            // Reset to top of the playlist.
            this.attributes['index'] = 0;
            this.attributes['offsetInMilliseconds'] = 0;
            this.attributes['playbackIndexChanged'] = true;
            controller.play.call(this);
        }
    }
}();

function canThrowCard() {
    /*
     * To determine when can a card should be inserted in the response.
     * In response to a PlaybackController Request (remote control events) we cannot issue a card,
     * Thus adding restriction of request type being "IntentRequest".
     */
    if (this.event.request.type === 'IntentRequest' && this.attributes['playbackIndexChanged']) {
        this.attributes['playbackIndexChanged'] = false;
        return true;
    } else {
        return false;
    }
}

function shuffleOrder(callback) {
    audioData(function(ad) {
      // Algorithm : Fisher-Yates shuffle
      var array = Array.apply(null, {length: ad.length}).map(Number.call, Number);
      var currentIndex = array.length;
      var temp, randomIndex;

      while (currentIndex >= 1) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temp = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temp;
      }
      callback(array);
    });
}
