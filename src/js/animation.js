import anime from 'animejs';
import _ from 'lodash';
import { concatStrings } from './myCommon';

const smallImage = 0.2;

/* Calculate the starting left position for the picture element. */
const calcLeftStart = function calcLeftStart(element) {
  const viewportWidth = window.innerWidth;
  const { offsetLeft } = element;
  return viewportWidth - offsetLeft;
};

/* Calculate the ending left position for the picture element. */
const calcLeftEnd = function calcLeftEnd(element) {
  const { offsetLeft } = element;
  const { width } = element;
  return (offsetLeft + width) * -1;
};

/**
 * Returns the minimum possible value that the element(picture) can shift.
 * This is calcucated by the height and y position values after "transform: scale"
 * has been applied.
 */
const getMinDelta = function getMinDelta(element) {
  const clientRect = element.getBoundingClientRect();
  return clientRect.y * -1;
};

/**
 * Returns the maximum possible value that the element(picture) can shift.
 * This is calcucated by the height and y position values after "transform: scale"
 * has been applied.
 */
const getMaxDelta = function getMaxDelta(element) {
  const viewportHeight = window.innerHeight;
  const clientRect = element.getBoundingClientRect();
  return viewportHeight - clientRect.y - clientRect.height;
};

/**
 * Returns the new possible y value. The value is calculated by the
 * size and the position of the element after "transform: scale" is applied.
 */
const getRandomY = function getRandomY(element) {
  const min = getMinDelta(element);
  const max = getMaxDelta(element);
  return _.random(min, max);
};

/* 4th Animation: Scroll to the right end of the viewport. When the picture gets off
   the viewport, its position gets reset to the left and repeat. */
const fourthAnimation = function fourthAnimation(picture, constParams) {
  const targetId = concatStrings('#', picture.id);
  const element = document.getElementById(picture.id);
  const leftStart = calcLeftStart(element);
  const leftEnd = calcLeftEnd(element);
  const newY = getRandomY(element);

  anime(_.assign({
    targets: targetId,
    loop: true,
    duration: 14000,
    easing: 'linear',
    translateX: [leftStart, leftEnd],
    translateY: [newY, newY],
    scale: smallImage,
  }, constParams));
};

/* 3rd Animation: Sliding to the right end until the picture reaches off screen. */
const thirdAnimation = function thirdAnimation(picture, constParams) {
  const targetId = concatStrings('#', picture.id);
  const element = document.getElementById(picture.id);
  const leftEnd = calcLeftEnd(element);

  anime(_.assign({
    targets: targetId,
    duration: 14000,
    easing: 'linear',
    translateX: leftEnd,
    scale: smallImage,
    complete: function complete() {
      fourthAnimation(picture, constParams);
    },
  }, constParams));
};

/* 2nd Animation: flipping and moving to far side. */
const secondAnimation = function secondAnimation(picture, constParams) {
  const targetId = concatStrings('#', picture.id);

  anime(_.assign({
    targets: targetId,
    duration: 4500,
    easing: 'easeOutExpo',
    scale: [1, smallImage],
    rotateX: '1turn',
    complete: function complete() {
      thirdAnimation(picture, constParams);
    },
  }, constParams));
};

/* 1st Animation: slide in + rotation */
const firstAnimation = function firstAnimation(picture, constParams) {
  const targetId = concatStrings('#', picture.id);

  anime(_.assign({
    targets: targetId,
    scale: ['*=2', 1],
    duration: 1500,
    complete: function completeFirstAnimation() {
      secondAnimation(picture, constParams);
    },
  }, constParams));
};

const preparePicture = function preparePicture(picture) {
  const rotateStyleY = ['20deg', '-20deg'];

  return Object.freeze({
    rotate: rotateStyleY[picture.getNumericPartOfId() % 2],
  });
};

/* Entry point of the animations. */
const startAnimation = function startAnimation(picture) {
  const animationConstParams = preparePicture(picture);
  const thisPicture = _.cloneDeep(picture);

  firstAnimation(thisPicture, animationConstParams);
};

export default startAnimation;
