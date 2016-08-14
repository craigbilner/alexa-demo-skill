'use strict';

process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;

const Alexa = require('alexa-sdk');
const newSessionHandlers = require('./handlers/new-session.handlers');
const stoppedHandlers = require('./handlers/stopped.handlers');
const gameStartHandlers = require('./handlers/game-start.handlers');
const playingHandlers = require('./handlers/playing.handlers');
const evilPigHandlers = require('./handlers/evil-pig.handlers');
const mysteriousWitchHandlers = require('./handlers/mysterious-witch.handlers');


module.exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.appId = event.session.application.applicationId;

  alexa.registerHandlers(
    newSessionHandlers,
    stoppedHandlers,
    gameStartHandlers,
    playingHandlers,
    evilPigHandlers,
    mysteriousWitchHandlers
  );
  alexa.execute();
};
