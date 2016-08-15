/* eslint-disable max-len */

const assert = require('assert');
const skill = require('../index');
const context = require('aws-lambda-mock-context');

const sessionStartIntent = require('./event-samples/new-session/session-start.intent');

const gameStartNoIntent = require('./event-samples/game-start/no.intent');
const gameStartYesIntent = require('./event-samples/game-start/yes.intent');
const gameStartCancelIntent = require('./event-samples/game-start/cancel.intent');
const gameStartHelpIntent = require('./event-samples/game-start/help.intent');
const gameStartStopIntent = require('./event-samples/game-start/stop.intent');

const stoppedYesIntent = require('./event-samples/stopped/yes.intent');
const stoppedNoIntent = require('./event-samples/stopped/no.intent');

const playingLeftIntent = require('./event-samples/playing/left.intent');
const playingRightIntent = require('./event-samples/playing/right.intent');

const mysteriousWitchOddIntent = require('./event-samples/mysterious-witch/odd.intent');
const mysteriousWitchEvenIntent = require('./event-samples/mysterious-witch/even.intent');
const mysteriousWitchBlaBlaBlaIntent = require('./event-samples/mysterious-witch/blablabla.intent');

const {
  gamePrelude,
  goodbye,
  gameStartHelp,
  keepGoing,
  enterForest,
  evilGoatPig,
  mysteriousWitch,
  cardConfirmation,
  pickANumber,
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

  describe('Yes', () => {
    it('Responds with entering forest and sets state to PLAYING', () =>
      runIntent(gameStartYesIntent)
        .then(({ outputSpeech, gameState }) => {
          assert.deepEqual(outputSpeech, sanitise(enterForest()));
          assert.deepEqual(gameState, GAME_STATES.PLAYING);
        }));

    describe('I would like to go left', () => {
      it('Responds with evil pig intro and sets state to EVIL_PIG', () =>
        runIntent(playingLeftIntent)
          .then(({ outputSpeech, gameState }) => {
            assert.deepEqual(outputSpeech, sanitise(evilGoatPig()));
            assert.deepEqual(gameState, GAME_STATES.EVIL_PIG);
          }));
    });

    describe('I would like to go right', () => {
      it('Responds with mysterious witch intro and sets state to MYSTERIOUS_WITCH', () =>
        runIntent(playingRightIntent)
          .then(({ outputSpeech, gameState }) => {
            assert.deepEqual(outputSpeech, sanitise(mysteriousWitch()));
            assert.deepEqual(gameState, GAME_STATES.MYSTERIOUS_WITCH);
          }));

      describe('There are seven cards', () => {
        it('Responds with confirmation', () =>
          runIntent(mysteriousWitchOddIntent)
            .then(({ outputSpeech }) => {
              assert.deepEqual(outputSpeech, cardConfirmation(false));
            }));
      });

      describe('There are four cards', () => {
        it('Responds with confirmation', () =>
          runIntent(mysteriousWitchEvenIntent)
            .then(({ outputSpeech }) => {
              assert.deepEqual(outputSpeech, cardConfirmation(true));
            }));
      });

      describe('Bla bla bla', () => {
        it('Advises how to answer question', () =>
          runIntent(mysteriousWitchBlaBlaBlaIntent)
            .then(({ outputSpeech }) => {
              assert.deepEqual(outputSpeech, pickANumber());
            }));
      });
    });
  });
});
