import anime from 'animejs';
import { Console, concatStrings } from './myCommon.js';

(function mainApp() {
  const pictures = [];

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

  /* Move the picture to the center of the viewport */
  const centering = function centeringPicture(id) {
    Console.log('centering called.');
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

    // Apply the new coordinates to the picture.
    $picture.offset({ left: newPointX, top: newPointY });
  };

  /* Reset the picture's position to the left of the viewport, where is the starting
     point of the 4th animation, which is scrolling to the right end of the viewport.
  */
  const resetPosition = function resetPosition(myId) {
    const $elem = $(concatStrings('#', myId));
    // the width here includes the margin.
    $elem.css({ left: concatStrings((-1 * $elem.outerWidth(true)), 'px') });
  };

  /* Initialize the position of the picture. */
  const initializePosition = function initializePosition(myId) {
    Console.log('initializePosition called.');
    resetPosition(myId);
  };

  /* 4th Animation: Scroll to the right end of the viewport. When the picture reaches
     the outside of the viewport. Its position gets reset to the left and repeat. */
  const fourthAnimation = function fourthAnimation(myId) {
    Console.log('fourthAnimation called. myId:', myId);

    const $image = $(concatStrings('#', myId));
    const $window = $(window);

    // Apply initialize position css.
    initializePosition(myId);

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

  const addImage = function addImage(url) {
    Console.log('addImage called.');

    const picture = new Picture(pictures.length, url);

    $('#main').append(picture.getElement());

    // Add an eventListener for arter loading the image.

    const addFirstAnimation = function addFirstAnimation() {
      Console.log('addFirstAnimation called.');

      // Make the picture to the center of the viewport.
      centering(picture.id);

      firstAnimation(picture.id);
    };

    picture.getElement().on('load', addFirstAnimation);

    pictures.push(picture);
  };

  /*
    Get the image from the url.
    This method returns jqXHR, so that the caller may use it as a Promise object.
  */
  const getImage = function getImage(url) {
    return $.get(url, () => { Console.log('getImage success.'); });
  };

  $(document).ready(() => {
    // ------------
    // Websocket
    // ------------
    let wsHost = window.location.origin.replace(/^http/, 'ws');
    const path = '/ws';
    wsHost += path;
    const ws = new WebSocket(wsHost);

    ws.onopen = function onopen() {
      Console.log('ws.onopen called.');
    };

    ws.onmessage = function onmessage(evt) {
      Console.log('ws.onmessage called.');
      Console.log('evt.data:', evt.data);

      const data = JSON.parse(evt.data);
      if (data.msg && data.msg === 'PONG') {
        return;
      }

      const url = concatStrings(window.location.origin, '/picture/', data.id);
      Console.log('url for the image: ', url);

      /* Retrieve the image using the url.
         If success, set the image to the screen.
      */
      $.when(getImage(url))
        .done((response) => {
          addImage(response);
        })
        .fail((err) => {
          Console.log('error occured:', err);
        });
    };

    ws.checkConnection = function checkConnection() {
      Console.log('ws.checkConnection called.');
      this.sendPING();
    };

    ws.sendPING = function sendPING() {
      ws.send('PING');
    };

    ws.onclose = function onclose(close) {
      Console.log('ws.onclose() called.');
      Console.log('close:', close);
    };

    ws.onerror = function onerror(evt) {
      Console.log('ws.onerror() called.');
      Console.log('evt:', evt);
    };

    // Periodic PING-PONG messaging to prevent the conncetion terminated by Heroku.
    // https://devcenter.heroku.com/articles/error-codes#h15-idle-connection
    const INTERVAL = 10000; // 10sec
    const keepConnection = function keepConnection() {
      Console.log('send_PING called');
      if (ws) {
        Console.log('true');
        ws.sendPING();
      } else {
        Console.log('false');
      }
    };
    const intervalID = setInterval(keepConnection, INTERVAL);

    // Set the click event to the add button.
    $('#check_btn').click(() => {
      Console.log('anime.running: ', anime.running);
      ws.checkConnection();
    });
  });
}(this));
