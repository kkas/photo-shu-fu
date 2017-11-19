(function(global){
   'use strict';

   let pictures = [];

   // Picture class using Pseudoclassical pattern
   const Picture = function(num, path) {
      this.id = 'newImg'+ num;
      this.path = path;
      this.$elem;
      this.initElement(num);
   };
   Picture.prototype.initElement = function(z_index) {
      console.log('initElement called');
      this.$elem = $("<img>")
         .attr("id", this.id)
         .attr("src", this.path)
         .attr("z-index", z_index)
         .addClass("newImg");
   };
   Picture.prototype.getElement = function() {
      console.log('getElement called');
      return this.$elem;
   };

   /* Move the picture to the center of the viewport */
   const centering = function(id) {
      console.log('centering called.');
      const $window = $(window);
      const $picture = $('#'+id);

      // Calculate the center of the viewport on the x and y axises.
      const half_point_x = $window.width() / 2;
      const half_point_y = $window.height() / 2;

      // Calculate the appropriate left coordinate of the picture.
      const half_width = $picture.outerWidth(true) / 2;
      const half_height = $picture.outerHeight(true) / 2;

      const new_point_y = half_point_y - half_height;
      const new_point_x = half_point_x - half_width;

      // Apply the new coordinates to the picture.
      $picture.offset({'left': new_point_x, 'top': new_point_y});
   };

    const addImage = function(url) {
       console.log("addImage called.");

       let picture = new Picture(pictures.length, url);

       $("#main").append(picture.getElement());

       // Add an eventListener for arter loading the image.
       picture.getElement().on('load', function addFirstAnimation() {
          console.log('addFirstAnimation called.');

          // Make the picture to the center of the viewport.
          centering(picture.id);

          firstAnimation(picture.id);
       });

       pictures.push(picture);
    };

    /* Initialize the position of the picture. */
    const initializePosition = function(myId) {
       console.log('initializePosition called.');
       resetPosition(myId);
    };

    /* Reset the picture's position to the left of the viewport, where is the starting
       point of the 4th animation, which is scrolling to the right end of the viewport.
    */
    const resetPosition = function(myId) {
       const $elem = $('#'+myId);

       // the width here includes the margin.
       $elem.css({'left': (-1 * $elem.outerWidth(true)) + 'px'});
    };

    /* 4th Animation: Scroll to the right end of the viewport. When the picture reaches
       the outside of the viewport. Its position gets reset to the left and repeat. */
    const fourthAnimation = function(myId) {
       console.log("fourthAnimation called. myId:", myId);

       const $image = $('#'+myId);
       const $window = $(window);

       // Apply initialize position css.
       initializePosition(myId);

       anime({
          targets: '#'+myId,
          loop: true,
          duration: 100000,
          easing: 'linear',
          translateX: function() {
             // Move this picture until it gets off of the viewport.
             return $window.width() + $image.outerWidth(true) - $image.offset().left;
          },
       });
    };

    /* 3rd Animation: Sliding to the right end until the picture reaches off screen.
     */
    const thirdAnimation = function(myId) {
       console.log("thirdAnimation called. myId:", myId);

       const viewportWidth = $(window).width();

       anime({
          targets: '#'+myId,
          duration: 100000,
          easing: 'linear',
          left: viewportWidth, //TODO:
          complete: function(){
             console.log("third completed.");
             fourthAnimation(myId);
          }
       });
    }; // end of thirdAnimation

    /* 2nd Animation: flipping and moving to far side.
     */
    const secondAnimation = function(myId) {
       console.log("secondAnimation called. myId:", myId);
       anime({
          targets: "#"+myId,
          duration: 5000,
          easing: 'easeOutExpo',
          //easing: 'linear',
          width: function() {
             return ($('#'+myId).width() * 0.3) + 'px';
          },
          height: function() {
             return ($('#'+myId).height() * 0.3) + 'px';
          },
          top: function() { return anime.random(0, 100) + 'vh'; },
          left: function() { return anime.random(0, 100) + 'vw'; },
          //left: function() { return anime.random(100, 200); },
          rotateX: [0, 360],
          complete: function() {
             console.log('secondAnimation.complete');
             thirdAnimation(myId);
          }
       });
    };

    /* 1st Animation: slide in + rotation
     */
    const firstAnimation = function(myId) {
       console.log('firstAnimation called.');
       anime({
          targets: "#"+myId,
          rotate: [ { value: '1turn', easing: 'easeOutExpo'} ],
          duration: 1000,
          complete: function(anim){
             console.log('first animation completed..');
             secondAnimation(myId);
          }
       });
    };

    /*
       Get the image from the url.
       This method returns jqXHR, so that the caller may use it as a Promise object.
    */
    function get_image(url) {
        return $.get(url, () => { console.log("get_image success.");});
    }

    $(document).ready(function(){
       // Set the click event to the add button.
       //    $('#add_btn').click(addImage);
       $('#check_btn').click(function() {
          console.log("anime.running: ", anime.running);
          ws._check_connection();
       });

       // ------------
       // Websocket
       // ------------
       let ws_host = global.location.origin.replace(/^http/, "ws");
       let path = '/ws';
       ws_host += path;
       let ws = new WebSocket(ws_host);

       ws.onopen = function() {
          console.log("ws.onopen called.");
       };

       ws.onmessage = function (evt) {
          console.log("ws.onmessage called.");
          console.log("evt.data:", evt.data);

          const data = JSON.parse(evt.data);
          if (data.msg && data.msg == "PONG") {
             return;
          }

          let url = global.location.origin + "/picture/" + data["id"];
          console.log("url for the image: ", url);

          /* Retrieve the image using the url.
             If success, set the image to the screen.
          */
          $.when(get_image(url))
             .done((data) => {
                addImage(data);
             })
             .fail((data) => {
                console.log("error occured:", data);
             });
       };

       ws._check_connection = function() {
           console.log('ws._check_connection called.');
           this._send_PING();
       };

       ws._send_PING = function() {
           ws.send("PING");
       }

       ws.onclose = function(close) {
           console.log('ws.onclose() called.');
           console.log('close:', close);
       };

       ws.onerror = function(evt) {
           console.log('ws.onerror() called.');
           console.log('evt:', evt);
       };

       // Periodic PING-PONG messaging to prevent the conncetion terminated by Heroku.
       //https://devcenter.heroku.com/articles/error-codes#h15-idle-connection
       let INTERVAL = 10000; // 10sec
       const send_PING = function() {
           console.log("send_PING called");
           if(ws) {
           console.log("true");
               ws._send_PING()
           } else {
               console.log("false");
           }
       };
       let intervalID = setInterval(send_PING, INTERVAL);
    });
})(this);
