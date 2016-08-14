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

module.exports.enterForest = () =>
  'You enter the dangerous forest from the south side where there\'s a fork in the road, do you go left or right?';

module.exports.evilGoatPig = () =>
  'There\'s an evil goat pig who offers you 30 pieces of silver, do you take it?';

module.exports.mysteriousWitch = () =>
  'There is a mysterious witch at a table with a pack of cards, how many cards do you see on her hook for a hand?';

module.exports.leftOrRight = () =>
  'Try saying, I would like to go left, or, I would like to go right.';

module.exports.pickANumber = () =>
  'Try saying, there are, then the number, cards, for example, there are five cards.';

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