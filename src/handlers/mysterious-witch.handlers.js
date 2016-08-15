'use strict';

const Alexa = require('alexa-sdk');
const coreHandlers = require('./core.handlers');
const mixinHandlers = require('../modules/utils').mixinHandlers;
const GAME_STATES = require('../enums').GAME_STATES;
const res = require('../responses');
const isEven = require('../modules/numbers').isEven;

module.exports = Alexa.CreateStateHandler(GAME_STATES.MYSTERIOUS_WITCH, mixinHandlers(coreHandlers,
  {
    NumberOfCardsIntent() {
      const answer = parseInt(this.event.request.intent.slots.NoOfCards.value, 10);
      const numberIsEven = isEven(answer);

      if (Number.isFinite(answer)) {
        res.tell.call(this, res.cardConfirmation(numberIsEven));
      } else {
        this.emitWithState('Unhandled');
      }
    },
    'AMAZON.HelpIntent': function() {
      res.ask.call(this, res.gameStartHelp());
    },
    Unhandled() {
      res.ask.call(this, res.pickANumber(), res.pickANumber());
    },
  }));
