// TODO: Move this to somewhere else.
const Console = {
  log: function logToConsole(...args) {
    console.log(args);
  },
};

const app = function mainApp(global) {
  const $mainDiv = $('#main');
  const $inputImage = $('#image');
  const $instruction = $('#instruction');
  const $previewPlaceholder = $('#preview_placeholder');

  // TODO: Move this to somewhere else.
  const concatStrings = function concatenateStrings(...args) {
    return args.join(',');
  };

  const removePreviewImage = function removePreviewImage() {
    Console.log('removePreviewImage called');
    $previewPlaceholder.empty();
  };

  const restoreInstruction = function restoreInstruction() {
    Console.log('restoreInstruction called');
    $instruction.show();
  };

  // Send a POST request to the server's api and register the picture selected by the client.
  // TODO: Replace this with the throwing animation.
  const postImage = function postImage(evt) {
    evt.preventDefault();

    const imageSrc = evt.target.src;

    // Send a post request
    $.ajax({
      url: 'picture',
      type: 'POST',
      data: JSON.stringify({
        data: imageSrc,
      }),
      // contentType: false,       // The content type used when sending data to the server.
      // cache: false,             // To unable request pages to be cached.
      // processData: false,       // Needs to be set 'false' since I am uploading an image.
      success: function postData(data) {
        $mainDiv.append(concatStrings('<p>', 'POST succeeded. data:', data, '</p>'));
        Console.log('data:', data);
        // Remove the picture from the img element.
        removePreviewImage();

        // Restore the icon.
        restoreInstruction();
      },
    });
  };

  const renderPreviewImage = function renderPreviewImage(evt) {
    Console.log('renderPreviewImage called. evt: ', evt);

    // Retrieve or create the new Img element.
    let $newImg = $('#selected_image');
    if ($newImg.length === 0) {
      // Create one.
      $newImg = $("<img id='selected_image'>");
      // Add an onclick event to send the picture.
      $newImg.click(postImage);
    }
    // Load the selected image.
    $newImg.attr('src', evt.target.result);

    // Load the selected image as a preview.
    $previewPlaceholder.append($newImg);
  };

  const hideInstruction = function hideInstruction() {
    $instruction.hide();
  };

  const loadPreviewImage = function loadPreviewImage(evt) {
    Console.log('loadPreviewImage called. evt: ', evt);

    // Hide the instruction.
    hideInstruction();

    // Render the preview image.
    renderPreviewImage(evt);
  };

  // Set an event when the client selects an image.
  $inputImage.change(function processSelectedImage(evt) {
    Console.log('$inputImage change called. evt: ', evt);

    // Retrieve the selected image.
    if (this.files.length !== 0) {
      const file = this.files[0];
      const reader = new global.FileReader();
      reader.readAsDataURL(file); // The data will be encoded as base64.

      // Set a callback function to render the selected image when the file is loaded.
      reader.onload = loadPreviewImage;
    }
  });
};

$(document).ready(app(this));
