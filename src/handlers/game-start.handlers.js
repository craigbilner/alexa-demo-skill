'use strict';

const Alexa = require('alexa-sdk');
const coreHandlers = require('./core.handlers');
const mixinHandlers = require('../modules/utils').mixinHandlers;
const GAME_STATES = require('../enums').GAME_STATES;
const res = require('../responses');

module.exports = Alexa.CreateStateHandler(GAME_STATES.GAME_START, mixinHandlers(coreHandlers, {
  GameIntro() {
    res.ask.call(this, res.gamePrelude());
  },
  'AMAZON.NoIntent': function() {
    res.tell.call(this, res.goodbye());
  },
  'AMAZON.HelpIntent': function() {
    res.ask.call(this, res.gameStartHelp());
  },
  Unhandled() {
    res.ask.call(this, res.yesOrNo(), res.yesOrNo());
  },
}));
