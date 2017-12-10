import startAnimation from './animation';
import { Console, concatStrings } from './myCommon';

const centerImage = function centerImage(id) {
  Console.log('centerImage is called. id:', id);
  const $window = $(window);
  const $picture = $(concatStrings('#', id));

  // Calculate the center of the viewport on the x and y axises.
  const halfPointX = $window.width() / 2;
  const halfPointY = $window.height() / 2;

  // Calculate the appropriate left coordinate of the picture.
  const halfWidth = $picture.outerWidth(true) / 2;
  const halfHeight = $picture.outerHeight(true) / 2;

  const newPointY = halfPointY - halfHeight;
  const newPointX = halfPointX - halfWidth;

  Console.log(
    'hPX, hPY, hW, hH, nPY, nPX',
    halfPointX, halfPointY, halfWidth, halfHeight, newPointY, newPointX,
  );
  Console.log(
    '$picture.outerWidth(true), $picture.outerHeight(true)',
    $picture.outerWidth(true), $picture.outerHeight(true),
  );
  Console.log('img.width', $picture.width());
  Console.log('$picture:', $picture);

  // Apply the new coordinates to the picture.
  $picture.offset({ left: newPointX, top: newPointY });
};

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
  this.$elem.on('load', (event) => { centerImage(event.target.id); });
};
Picture.prototype.getElement = function getElement() {
  Console.log('getElement called');
  return this.$elem;
};
Picture.prototype.animate = function animate() {
  startAnimation(this);
};

export default Picture;
