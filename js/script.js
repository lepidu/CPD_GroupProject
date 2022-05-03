'use strict';
const electron = require('electron');
const dialog = electron.remote.dialog;
const fs = require('fs');
let photoData;
let video;

var myInput = document.getElementById("psw");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");
var special = document.getElementById("special");

// When the user clicks on the password field, show the message box
myInput.onfocus = function() {
  document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function() {
  document.getElementById("message").style.display = "none";
}

// When the user starts to type something inside the password field
myInput.onkeyup = function(){
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if(myInput.value.match(lowerCaseLetters)) {  
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
  }
  
  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if(myInput.value.match(upperCaseLetters)) {  
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if(myInput.value.match(numbers)) {  
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }

  // Validate special
  var special = /[!@#$%^&*(),.?":{}|<>]/g;
  if(myInput.value.match(numbers)) {  
   number.classList.remove("invalid");
   number.classList.add("valid");
 } else {
   number.classList.remove("valid");
   number.classList.add("invalid");
 }

  // Validate length
  if(myInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
}

// Webcam
function savePhoto (filePath) {
 if (filePath) {
 fs.writeFile(filePath, photoData, 'base64', (err) => {
 if (err) alert(`There was a problem saving the photo: ${err.message}`);
 photoData = null;
 });
 }
}
function initialize () {
 video = window.document.querySelector('video');
 let errorCallback = (error) => {
 console.log(`There was an error connecting to the video stream:
${error.message}`);
 };
 window.navigator.webkitGetUserMedia({video: true}, (localMediaStream) => {
 video.src = window.URL.createObjectURL(localMediaStream);
 }, errorCallback);
}
function takePhoto () {
  let canvas = window.document.querySelector('canvas');
 canvas.getContext('2d').drawImage(video, 0, 0, 800, 600);
 photoData =
canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg|jpeg);base64,/
, '');
 dialog.showSaveDialog({
 title: "Save the photo",
 defaultPath: 'myfacebomb.png',
 buttonLabel: 'Save photo'
 }, savePhoto);
}
window.onload = initialize;
