/**
 * Console bot - Echo
 */
"use strict";

var builder = require("botbuilder");

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
bot.dialog('/', function (session) {
    //console.log(session.message);
    session.send(session.message.text);
});