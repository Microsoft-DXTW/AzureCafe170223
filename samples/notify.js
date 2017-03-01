/**
 * Waterfall
 */
"use strict";

var builder = require("botbuilder");
var restify = require("restify");

var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector);
bot.dialog('/', function (session) {
    console.log(JSON.stringify(session.message.address));
    //session.sendTyping();
    session.endDialog(session.message.text);
});

var server = restify.createServer();
server.listen(3978, function() {
    console.log('test bot endpont at http://localhost:3978/api/messages');
});
server.post('/api/messages', connector.listen());
server.use(restify.bodyParser());
server.post('/api/notify', function (req, res) {
    // Process posted notification
    console.log(req.params);
    var address = JSON.parse(req.params.address);
    var notification = req.params.notification;

    // Send notification as a proactive message
    var msg = new builder.Message()
        .address(address)
        .text(notification);

    bot.send(msg, function (err) {
        // Return success/failure
        res.status(err ? 500 : 200);
        res.end();
    });
});