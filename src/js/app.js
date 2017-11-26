import { Console, concatStrings } from './myCommon';
import Picture from './Picture';

(function mainApp() {
  const pictures = [];

  const addImage = function addImage(url) {
    Console.log('addImage called.');

    const picture = new Picture(pictures.length, url);

    $('#main').append(picture.getElement());

    // Start the animation of this picture.
    picture.animate();

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
      ws.checkConnection();
    });
  });
}(this));
