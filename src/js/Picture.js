import startAnimation from './animation';

// Picture class using Pseudoclassical pattern
const Picture = function Picture(num, path) {
  this.id = this.generateImgId(num);
  this.path = path;
  this.elem = null;
  this.initElement(num);
};
Picture.prototype.generateImgId = function generateImgId(num) {
  return `newImg${num}`;
};
Picture.prototype.initElement = function initElement(zIndex) {
  this.elem = document.createElement('img');
  this.elem.setAttribute('id', this.id);
  this.elem.setAttribute('src', this.path);
  this.elem.setAttribute('z-index', zIndex);
  this.elem.classList.add('newImg');

  // Set the picture at the center of the screen for when the image is loaded.
  this.elem.addEventListener('load', () => {
    this.elem.classList.add('initPosition');
  });
};
Picture.prototype.getElement = function getElement() {
  return this.elem;
};
Picture.prototype.animate = function animate() {
  startAnimation(this);
};
Picture.prototype.getNumericPartOfId = function getNumericPartOfId() {
  return this.id.split('newImg')[1];
};

export default Picture;
