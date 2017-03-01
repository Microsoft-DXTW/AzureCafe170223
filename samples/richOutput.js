/**
 * Waterfall
 */
"use strict";

var builder = require("botbuilder");
var restify = require("restify");
var request = require('request');

var IMGSEARCH_URL = 'https://api.cognitive.microsoft.com/bing/v5.0/images/search'
var BING_KEY = 'MICROSOFT_COGNITIVE_SERVICE_BING_IMAGE_SEARCH_KEY';

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
var server = restify.createServer();
server.listen(3978, function() {
    console.log('test bot endpont at http://localhost:3978/api/messages');
});
server.post('/api/messages', connector.listen());
bot.dialog('/', function(session){
    var msg = session.message;
    var postOpt = {
            url: IMGSEARCH_URL + '?q=' + msg.text,
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': BING_KEY
            },
            
        };
    session.sendTyping();
    request.post(postOpt, function(error, response, body){
        var msgBody = JSON.parse(body);
        var imgArr = [];
        for (var i = 0; i < msgBody.value.length; ++i) {
            var img = msgBody.value[i];
            imgArr.push(new builder.HeroCard(session)
                .title(img.name)
                .images([
                    builder.CardImage.create(session, img.thumbnailUrl)
                ])
                .tap(builder.CardAction.openUrl(session, img.contentUrl))
            );
        }
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments(imgArr)
            .attachmentLayout('carousel');
        session.endDialog(msg);
    });
});
