import anime from 'animejs';
import { Console, concatStrings } from './myCommon';

/* Reset the picture's position to the left of the viewport, where is the starting
  point of the 4th animation, which is scrolling to the right end of the viewport.
*/
const resetPosition = function resetPosition(myId) {
  const $elem = $(concatStrings('#', myId));
  // the width here includes the margin.
  $elem.css({ left: concatStrings((-1 * $elem.outerWidth(true)), 'px') });
};

/* 4th Animation: Scroll to the right end of the viewport. When the picture reaches
   the outside of the viewport. Its position gets reset to the left and repeat. */
const fourthAnimation = function fourthAnimation(myId) {
  Console.log('fourthAnimation called. myId:', myId);

  const $image = $(concatStrings('#', myId));
  const $window = $(window);

  // Reset position.
  resetPosition(myId);

  anime({
    targets: concatStrings('#', myId),
    loop: true,
    duration: 100000,
    easing: 'linear',
    translateX: function translateX() {
      // Move this picture until it gets off of the viewport.
      return ($window.width() + $image.outerWidth(true)) - $image.offset().left;
    },
  });
};

/* 3rd Animation: Sliding to the right end until the picture reaches off screen. */
const thirdAnimation = function thirdAnimation(myId) {
  Console.log('thirdAnimation called. myId:', myId);

  const viewportWidth = $(window).width();

  anime({
    targets: concatStrings('#', myId),
    duration: 100000,
    easing: 'linear',
    left: viewportWidth,
    complete: function complete() {
      Console.log('third completed.');
      fourthAnimation(myId);
    },
  });
}; // end of thirdAnimation

/* 2nd Animation: flipping and moving to far side. */
const secondAnimation = function secondAnimation(myId) {
  Console.log('secondAnimation called. myId:', myId);
  anime({
    targets: concatStrings('#', myId),
    duration: 5000,
    easing: 'easeOutExpo',
    width: function width() {
      const id = concatStrings('#', myId);
      const newWidth = $(id).width() * 0.3;
      return concatStrings(newWidth, 'px');
    },
    height: function height() {
      const id = concatStrings('#', myId);
      const newHeight = $(id).height() * 0.3;
      return concatStrings(newHeight, 'px');
    },
    top: function top() { return concatStrings(anime.random(0, 100), 'vh'); },
    left: function left() { return concatStrings(anime.random(0, 100), 'vw'); },
    rotateX: [0, 360],
    complete: function complete() {
      Console.log('secondAnimation.complete');
      thirdAnimation(myId);
    },
  });
};

/* 1st Animation: slide in + rotation */
const firstAnimation = function firstAnimation(myId) {
  Console.log('firstAnimation called.');
  anime({
    targets: concatStrings('#', myId),
    rotate: [{ value: '1turn', easing: 'easeOutExpo' }],
    duration: 1000,
    complete: function completeFirstAnimation() {
      Console.log('first animation completed..');
      secondAnimation(myId);
    },
  });
};

const startAnimation = function startAnimation(picture) {
  firstAnimation(picture.id);
};

export default startAnimation;
