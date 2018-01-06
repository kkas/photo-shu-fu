import startAnimation from './animation';
import { concatStrings } from './myCommon';

class Picture {
  constructor(num, path) {
    this.id = concatStrings('newImg', num);
    this.path = path;
    this.element = null;
    this.initElement(num);
  }

  initElement(zIndex) {
    this.element = document.createElement('img');

    this.element.setAttribute('id', this.id);
    this.element.setAttribute('src', this.path);
    this.element.setAttribute('z-index', zIndex);

    this.element.classList.add('newImg');

    // Set the picture at the center of the screen for when the image is loaded.
    this.element.addEventListener('load', () => {
      this.element.classList.add('initPosition');
    });
  }

  animate() {
    startAnimation(this);
  }

  get numericPartOfId() {
    return this.id.split('newImg')[1];
  }
}

export default Picture;
