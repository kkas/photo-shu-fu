$(document).ready(function(){
   let $main_div = $('#main');
   let URL = location.origin;

   const $input_image = $('#image');
   const $instruction =$('#instruction');
   const $camera_img = $('#camera_img');
   const $preview = $('#preview');
   const $preview_placeholder = $('#preview_placeholder');

   const send = function(url) {
       $main_div.append('<p>' + URL + 'registerPicture' + 'called </p>');
       //ws.send("NEW:https://photo-shu-fu.herokuapp.com/static/static/cute_cat2.jpg");
       ws.send("NEW:" + url);
   };

   // Set an event when the client taphold the camera image.
   $camera_img.bind(
       (function() {
           // considered as a longpress after this value in milliseconds.
           const longpress = 3000;
           // start time
           let start_time = 0;

           return {
               contextmenu: function() { return false; }, // To prevent right click menu on labtops.
               mousedown: function() {
                   console.log("mousedown fired");
                   $main_div.append('<p>' + 'mousedown fired' + '</p>');
                   start_time = new Date().getTime();
                   return false;
               },
               mouseleave: function() {
                   $main_div.append('<p>' + 'mouseleave fired' + '</p>');
                   start_time = 0;
                   return false;
               },
               mouseup: function() {
                   $main_div.append('<p>' + 'mouseup fired' + '</p>');
                   if (new Date().getTime() >= (start_time + longpress)) {
                      console.log("long press");
                      $main_div.append('<p>' + 'long press' + '</p>');
                   } else {
                      console.log("short press");
                      $main_div.append('<p>' + 'short press' + '</p>');
                   }
                   return false;
               },
               touchstart: function() {
                   $main_div.append('<p>' + 'touchstart fired' + '</p>');
                   return false;
               },
               touchmove: function() {
                   $main_div.append('<p>' + 'touchmove fired' + '</p>');
                   return false;
               },
               touchend: function() {
                   $main_div.append('<p>' + 'touchend fired' + '</p>');
                   return false;
               },
           }
       })(),
   );

   // Set an event when the client selects an image.
   $input_image.change(function(evt) {
      // Retrieve the selected image.
      const file = this.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);  // The data will be encoded as base64.

      // Set a callback function to render the selected image when the file is loaded.
      reader.onload = load_preview_image;
   });

   const load_preview_image = function(evt) {
      console.log('load_preview_image called. evt: ', evt);

      // Hide the instruction.
      hide_instruction();

      // Render the preview image.
      render_preview_image(evt);
   }

   const render_preview_image = function(evt) {
      console.log('render_preview_image called. evt: ', evt);

      // Retrieve or create the new Img element.
      let $new_img = $('#selected_image');
      if ($new_img.length == 0) {
          // Create one.
          $new_img = $("<img id='selected_image'>");

          // Add an onclick event to send the picture.
          $new_img.click(post_image);
      }

      // Load the selected image.
      $new_img.attr('src', evt.target.result);

      // Load the selected image as a preview.
      $preview_placeholder.append($new_img);
   };

   const remove_preview_image = function(evt) {
      console.log('remove_preview_image called');
      $preview_placeholder.empty();
   };

   const hide_instruction = function(evt) {
      $instruction.hide();
   }

   const restore_instruction = function(evt) {
      console.log('restore_instruction called');
      $instruction.show();
   }

   // Send a POST request to the server's api and register the picture selected by the client.
   // TODO: Replace this with the throwing animation.
   const post_image = function(evt) {
       evt.preventDefault();

       const src = evt.target.src;
       //console.log('src: ', src);
       //let $pictureForm = $('form[name=picture]');

       // Send a post request
       $.ajax({
           url: 'picture',
           type: 'POST',
           data: JSON.stringify({
               data: src
           }),
           // contentType: false,       // The content type used when sending data to the server.
           //  cache: false,             // To unable request pages to be cached.
           // processData: false,       // Needs to be set 'false' since I am uploading an image.
           success: function(data) {
               $main_div.append('<p>' + 'POST succeeded. data:' + data + '</p>');
               console.log('data:', data)

               //// Send the image directly to the screen app.
               //send(src);

               // Remove the picture from the img element.
               remove_preview_image();

               // Restore the icon.
               restore_instruction();
           },
       });
   };
});