import { Console } from './myCommon.js';

// Picture class using Pseudoclassical pattern
const Picture = function Picture(num, path) {
  this.id = this.generateImgId(num);
  this.path = path;
  this.$elem;
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

export default Picture;
