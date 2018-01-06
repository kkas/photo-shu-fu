import anime from 'animejs';
import { Console, concatStrings } from './myCommon';

const inputImage = document.getElementById('inputImage');
const instruction = document.getElementById('instruction');
const previewPlaceholder = document.getElementById('preview_placeholder');

const removeChildren = function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const removePreviewImage = function removePreviewImage() {
  removeChildren(previewPlaceholder);
};

const restoreInstruction = function restoreInstruction() {
  instruction.setAttribute('style', 'display: block');
};

const animate = function animate(id) {
  const targetId = concatStrings('#', id);
  const element = document.getElementById(id);
  Console.log('targetId:', targetId);
  Console.log('element:', element);
  const clientRect = element.getBoundingClientRect();

  anime({
    targets: targetId,
    duration: 2000,
    easing: 'easeInCubic',
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
const postImage = function postImage(evt) {
  evt.preventDefault();

  const imageSrc = evt.target.src;

  // Send a post request
  const httpRequest = new XMLHttpRequest();
  const formData = new FormData();

  // Set the contents
  formData.set('data', imageSrc);

  // Set a handler to process the response.
  httpRequest.onreadystatechange = function stateChangeHandler() {
    try {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          const response = JSON.parse(httpRequest.responseText);
          Console.log('response:', response);
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
  httpRequest.open('POST', 'picture', true);

  // Set the request header.
  httpRequest.setRequestHeader('Content-Type', 'application/json');

  // Send the data.
  httpRequest.send(JSON.stringify({
    data: imageSrc,
  }));
};

const sendImage = function sendImage(evt) {
  // Animate the selected picture.
  animate(evt.target.id);

  postImage(evt);
};

const renderPreviewImage = function renderPreviewImage(evt) {
  // Retrieve or create the new Img element.
  let newImg = document.getElementById('selected_image');

  if (newImg === null) {
    // Create one.
    newImg = document.createElement('img');
    newImg.id = 'selected_image';

    // Add an onclick event to send the picture.
    newImg.addEventListener('click', sendImage);
  }
  // Load the selected image.
  newImg.setAttribute('src', evt.target.result);

  // Load the selected image as a preview.
  previewPlaceholder.appendChild(newImg);
};

const hideInstruction = function hideInstruction() {
  instruction.setAttribute('style', 'display: none');
};

const loadPreviewImage = function loadPreviewImage(evt) {
  // Hide the instruction.
  hideInstruction();

  // Render the preview image.
  renderPreviewImage(evt);
};

// Set an event when the client selects an image.
inputImage.addEventListener('change', function processSelectedImage() {
  // Retrieve the selected image.
  if (this.files.length !== 0) {
    const file = this.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file); // The data will be encoded as base64.

    // Set a callback function to render the selected image when the file is loaded.
    reader.onload = loadPreviewImage;
  }
});
