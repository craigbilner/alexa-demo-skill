/* eslint-disable max-len */

const assert = require('assert');
const skill = require('../index');
const context = require('aws-lambda-mock-context');

const sessionStartIntent = require('./event-samples/new-session/session-start.intent');

const gameStartNoIntent = require('./event-samples/game-start/no.intent');
const gameStartCancelIntent = require('./event-samples/game-start/cancel.intent');
const gameStartHelpIntent = require('./event-samples/game-start/help.intent');
const gameStartStopIntent = require('./event-samples/game-start/stop.intent');

const stoppedYesIntent = require('./event-samples/stopped/yes.intent');
const stoppedNoIntent = require('./event-samples/stopped/no.intent');

const {
  gamePrelude,
  goodbye,
  gameStartHelp,
  keepGoing,
} = require('../responses');
const { GAME_STATES } = require('../enums');

const sanitise = text => text.replace(/\n/g, '');

const getOutputSpeech = ({ response: { outputSpeech: { ssml } } }) =>
  sanitise(ssml).match(/<speak>(.*)<\/speak>/i)[1].trim();
const getAttribute = ({ sessionAttributes }, attr) => sessionAttributes[attr];
const runIntent = intent => new Promise(res => {
  const ctx = context();
  skill.handler(intent, ctx);

  ctx
    .Promise
    .then(obj => {
      // console.log(obj);
      res({
        endOfSession: obj.response.shouldEndSession,
        outputSpeech: getOutputSpeech(obj),
        gameState: getAttribute(obj, 'STATE'),
      });
    })
    .catch(err => {
      throw new Error(err);
    });
});

describe('Alexa, start game', () => {
  it('Responds with game prelude and sets state to GAME_START', () =>
    runIntent(sessionStartIntent)
      .then(({ outputSpeech, gameState }) => {
        assert.deepEqual(outputSpeech, sanitise(gamePrelude()));
        assert.deepEqual(gameState, GAME_STATES.GAME_START);
      }));

  describe('Help', () => {
    it('Responds with game start help without changing state', () =>
      runIntent(gameStartHelpIntent)
        .then(({ outputSpeech, gameState }) => {
          assert.deepEqual(outputSpeech, sanitise(gameStartHelp()));
          assert.deepEqual(gameState, GAME_STATES.GAME_START);
        }));

    describe('No', () => {
      it('Responds with goodbye and ends the session', () =>
        runIntent(gameStartNoIntent)
          .then(({ outputSpeech, endOfSession }) => {
            assert.deepEqual(outputSpeech, sanitise(goodbye()));
            assert(endOfSession);
          }));
    });
  });

  describe('Stop', () => {
    it('Responds with continue game question and sets state to STOPPED', () =>
      runIntent(gameStartStopIntent)
        .then(({ outputSpeech, gameState }) => {
          assert.deepEqual(outputSpeech, sanitise(keepGoing()));
          assert.deepEqual(gameState, GAME_STATES.STOPPED);
        }));

    describe('Yes', () => {
      it('Responds with game prelude and sets state to GAME_START', () =>
        runIntent(stoppedYesIntent)
          .then(({ outputSpeech, gameState }) => {
            assert.deepEqual(outputSpeech, sanitise(gamePrelude()));
            assert.deepEqual(gameState, GAME_STATES.GAME_START);
          }));
    });

    describe('No', () => {
      it('Responds with goodbye and ends the session', () =>
        runIntent(stoppedNoIntent)
          .then(({ outputSpeech, endOfSession }) => {
            assert.deepEqual(outputSpeech, sanitise(goodbye()));
            assert(endOfSession);
          }));
    });
  });

  describe('Cancel', () => {
    it('Responds with goodbye and ends the session', () =>
      runIntent(gameStartCancelIntent)
        .then(({ outputSpeech, endOfSession }) => {
          assert.deepEqual(outputSpeech, sanitise(goodbye()));
          assert(endOfSession);
        }));
  });

  describe('No', () => {
    it('Responds with goodbye and ends the session', () =>
      runIntent(gameStartNoIntent)
        .then(({ outputSpeech, endOfSession }) => {
          assert.deepEqual(outputSpeech, sanitise(goodbye()));
          assert(endOfSession);
        }));
  });
});
