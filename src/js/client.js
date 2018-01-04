import anime from 'animejs';
import { Console, concatStrings } from './myCommon';

const $inputImage = $('#image');
const $instruction = $('#instruction');
const $previewPlaceholder = $('#preview_placeholder');

const removePreviewImage = function removePreviewImage() {
  $previewPlaceholder.empty();
};

const restoreInstruction = function restoreInstruction() {
  $instruction.show();
};

const animate = function animate(id) {
  const targetId = concatStrings('#', id);
  const element = document.getElementById(id);
  Console.log('targetId:', targetId);
  Console.log('element:', element);
  const clientRect = element.getBoundingClientRect();

  anime({
    targets: targetId,
    duration: 1000,
    easing: 'easeInQuart',
    translateY: clientRect.height * -1,
    complete: function complete() {
      // Remove the picture from the img element.
      removePreviewImage();

      // Restore the icon.
      restoreInstruction();
    },
  });
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
    success: function postData(data) {
      Console.log('data:', data);
    },
  });
};

const sendImage = function sendImage(evt) {
  // Animate the selected picture.
  animate(evt.target.id);

  postImage(evt);
};

const renderPreviewImage = function renderPreviewImage(evt) {
  // Retrieve or create the new Img element.
  let $newImg = $('#selected_image');

  if ($newImg.length === 0) {
    // Create one.
    $newImg = $("<img id='selected_image'>");

    // Add an onclick event to send the picture.
    $newImg.click(sendImage);
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
  // Hide the instruction.
  hideInstruction();

  // Render the preview image.
  renderPreviewImage(evt);
};

// Set an event when the client selects an image.
$inputImage.change(function processSelectedImage() {
  // Retrieve the selected image.
  if (this.files.length !== 0) {
    const file = this.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file); // The data will be encoded as base64.

    // Set a callback function to render the selected image when the file is loaded.
    reader.onload = loadPreviewImage;
  }
});
