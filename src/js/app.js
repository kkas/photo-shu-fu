import { Console, concatStrings } from './myCommon';
import Picture from './Picture';

(function mainApp() {
  const pictures = [];

  const addImage = (url) => {
    const picture = new Picture(pictures.length, url);

    const mainElem = document.getElementById('main');
    mainElem.appendChild(picture.element);

    // Start the animation of this picture.
    picture.animate();

    pictures.push(picture);
  };

  const retrieveImage = (url, callback) => {
    // Make a GET reqest.
    const httpRequest = new XMLHttpRequest();

    // Set a handler to process the response.
    httpRequest.onreadystatechange = function stateChangeHandler() {
      try {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            const response = httpRequest.responseText;
            Console.log('response:', response);
            callback(response);
          } else {
            // Error occured.
            Console.error('There was a problem with the request.');
          }
        }
      } catch (e) {
        Console.error('Caught Exception: ', e.description);
      }
    };

    // Process the request asynchronously.
    httpRequest.open('GET', url, true);

    // Send the request
    httpRequest.send(null);
  };

  window.addEventListener('load', () => {
    // ------------
    // Websocket
    // ------------
    let wsHost = window.location.origin.replace(/^http/, 'ws');
    const path = '/ws';
    wsHost += path;
    const ws = new WebSocket(wsHost);

    ws.onopen = () => {
      Console.log('ws.onopen called.');
    };

    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);

      if (data.msg && data.msg === 'PONG') {
        return;
      }

      const url = concatStrings(window.location.origin, '/picture/', data.id);

      retrieveImage(url, addImage);
    };

    ws.checkConnection = () => {
      this.sendPING();
    };

    ws.sendPING = () => {
      ws.send('PING');
    };

    ws.onclose = (close) => {
      Console.log('ws.onclose() called.');
      Console.log('close:', close);
    };

    ws.onerror = (evt) => {
      Console.log('ws.onerror() called.');
      Console.log('evt:', evt);
    };

    // Periodic PING-PONG messaging to prevent the conncetion terminated by Heroku.
    // https://devcenter.heroku.com/articles/error-codes#h15-idle-connection
    const INTERVAL = 10000; // 10sec
    const keepConnection = () => {
      if (ws) {
        ws.sendPING();
      }
    };
    const intervalID = setInterval(keepConnection, INTERVAL);
  });
}(this));
