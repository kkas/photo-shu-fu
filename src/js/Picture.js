import startAnimation from './animation.js';
import { Console } from './myCommon.js';

// Picture class using Pseudoclassical pattern
const Picture = function Picture(num, path) {
  this.id = this.generateImgId(num);
  this.path = path;
  this.$elem = null;
  this.initElement(num);
};
Picture.prototype.generateImgId = function generateImgId(num) {
  return `newImg${num}`;
};
Picture.prototype.initElement = function initElement(zIndex) {
  Console.log('initElement called');
  this.$elem = $('<img>')
    .attr('id', this.id)
    .attr('src', this.path)
    .attr('z-index', zIndex)
    .addClass('newImg');
};
Picture.prototype.getElement = function getElement() {
  Console.log('getElement called');
  return this.$elem;
};
Picture.prototype.onLoad = function onLoad(f) {
  this.$elem.on('load', f);
};
Picture.prototype.centering = function centering() {
  Console.log('Picture.centering is called.');
  const $window = $(window);

  // Calculate the center of the viewport on the x and y axises.
  const halfPointX = $window.width() / 2;
  const halfPointY = $window.height() / 2;

  // Calculate the appropriate left coordinate of the picture.
  const halfWidth = this.$elem.outerWidth(true) / 2;
  const halfHeight = this.$elem.outerHeight(true) / 2;

  const newPointY = halfPointY - halfHeight;
  const newPointX = halfPointX - halfWidth;

  // Apply the new coordinates to the picture.
  this.$elem.offset({ left: newPointX, top: newPointY });
};
Picture.prototype.animate = function animate() {
  // Set the picture at the center of the screen.
  this.centering();
  // Add an eventListener for arter loading the image.
  this.onLoad(startAnimation(this));
};

export default Picture;
