// import _ from 'lodash';
import startAnimation from './animation';
import { Console, concatStrings } from './myCommon';

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

  // Set the picture at the center of the screen for when the image is loaded.
  this.$elem.on('load', (event) => {
    $(concatStrings('#', event.target.id)).addClass('initPosition');
  });
};
Picture.prototype.getElement = function getElement() {
  return this.$elem;
};
Picture.prototype.animate = function animate() {
  startAnimation(this);
};
Picture.prototype.getNumericPartOfId = function getNumericPartOfId() {
  return this.id.split('newImg')[1];
};

export default Picture;
