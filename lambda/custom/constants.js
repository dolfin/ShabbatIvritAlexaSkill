"use strict";

module.exports = Object.freeze({

    // App-ID. TODO: set to your own Skill App ID from the developer portal.
    appId : 'amzn1.ask.skill.649e1730-79f7-437b-bf4c-7f5f0064c9ab',

    //  DynamoDB Table name. TODO: define a name for the table to store playback info for users
    dynamoDBTableName : 'ShabbatIvritSkill',

    scrapeUrl : 'https://103fm.maariv.co.il/program/%D7%A9%D7%91%D7%AA-%D7%A2%D7%91%D7%A8%D7%99%D7%AA-%D7%A7%D7%9C%D7%90%D7%A1%D7%99%D7%A7%D7%95%D7%AA-%D7%9E%D7%95%D7%96%D7%99%D7%A7%D7%94-%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99%D7%AA.aspx',
    scrapeEpisodePrefix : 'https://103fm.maariv.co.il',
    mediaPrefix : 'https://103fm_aod_main.streamgates.net/103fm_aod/',
    mediaSuffix : '.mp3',

    states : {
        START_MODE : '',
        PLAY_MODE : '_PLAY_MODE'
    }
});
