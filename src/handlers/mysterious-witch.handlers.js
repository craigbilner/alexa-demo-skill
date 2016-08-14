'use strict';

const Alexa = require('alexa-sdk');
const coreHandlers = require('./core.handlers');
const mixinHandlers = require('../modules/utils').mixinHandlers;
const GAME_STATES = require('../enums').GAME_STATES;
const res = require('../responses');

module.exports = Alexa.CreateStateHandler(GAME_STATES.MYSTERIOUS_WITCH, mixinHandlers(coreHandlers, {
  NumberOfCardsIntent() {

  },
  'AMAZON.HelpIntent': function() {
    res.ask.call(this, res.gameStartHelp());
  },
  Unhandled() {
    res.ask.call(this, res.pickANumber(), res.pickANumber());
  },
}));
