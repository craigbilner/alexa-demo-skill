/* eslint-ignore max-len */

'use strict';

module.exports.gamePrelude = () =>
  'This is a dangerous game of cat and mouse, in the even more dangerous, dangerous forest...do you want to play?'

module.exports.gameStartHelp = () =>
  'Create your own adventure by answering each question which will lead you down different paths, would you like to play?';

module.exports.keepGoing = () =>
  'Continue with game?';

module.exports.goodbye = () =>
  'Oh well, maybe next time hey?';

module.exports.yesOrNo = () =>
  'So is that a yes or a no...?';

module.exports.ask = function(sayWhat, continuation) {
  // updates
  this.attributes.previousState = this.handler.state;
  this.attributes.previousResponse = continuation || sayWhat;

  // response
  this.emit(':ask', sayWhat);
};

module.exports.tell = function(tellWhat) {
  this.emit(':tell', tellWhat);
};