"use strict";

module.exports = Object.freeze({

    // App-ID. TODO: set to your own Skill App ID from the developer portal.
    appId : 'amzn1.ask.skill.649e1730-79f7-437b-bf4c-7f5f0064c9ab',

    //  DynamoDB Table name. TODO: define a name for the table to store playback info for users
    dynamoDBTableName : 'ShabbatIvritSkill',

    states : {
        START_MODE : '',
        PLAY_MODE : '_PLAY_MODE'
    }
});
