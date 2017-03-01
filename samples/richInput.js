/**
 * Waterfall
 */
"use strict";

var builder = require("botbuilder");
var restify = require("restify");
var request = require('request');

var VISION_URL = 'https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze'
var VISION_KEY = 'MICROSOFT_COGNITIVE_SERVICE_COMPUTER_VISION_KEY';

var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector);
var server = restify.createServer();
server.listen(3978, function() {
    console.log('test bot endpont at http://localhost:3978/api/messages');
});
server.post('/api/messages', connector.listen());
bot.dialog('/', function(session){
    var msg = session.message;
    if (msg.attachments.length > 0) {
        session.sendTyping();
        var postOpt = {
            url: 'https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': VISION_KEY
            },
            json: {
                url: msg.attachments[0].contentUrl
            }
        };
        request.post(postOpt, function(error, response, body){
            console.log(body.description);
            session.endDialog(body.description.captions[0].text);
        });
    }

});
