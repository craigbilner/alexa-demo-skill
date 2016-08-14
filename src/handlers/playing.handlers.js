'use strict';

const Alexa = require('alexa-sdk');
const coreHandlers = require('./core.handlers');
const mixinHandlers = require('../modules/utils').mixinHandlers;
const GAME_STATES = require('../enums').GAME_STATES;
const res = require('../responses');

module.exports = Alexa.CreateStateHandler(GAME_STATES.PLAYING, mixinHandlers(coreHandlers, {
  GoLeftIntent() {
    // updates
    this.handler.state = GAME_STATES.EVIL_PIG;

    // response
    res.ask.call(this, res.evilGoatPig());
  },
  GoRightIntent() {
    // updates
    this.handler.state = GAME_STATES.MYSTERIOUS_WITCH;

    // response
    res.ask.call(this, res.mysteriousWitch());
  },
  'AMAZON.HelpIntent': function() {
    res.ask.call(this, res.gameStartHelp());
  },
  Unhandled() {
    res.ask.call(this, res.leftOrRight(), res.leftOrRight());
  },
}));
