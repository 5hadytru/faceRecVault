/**
 *      This is the home page; index.js because I am monke
 */

'use strict'
import {createEncoding, handleEncodingResponse} from './functions'


// setting up DOM components
const video = document.getElementById("video");
const canvas = document.getElementsByTagName("canvas")[0];
const snap = document.getElementById("snap");
const errorMsg = document.getElementById("span#errorMsg");
const logInBtn = document.querySelector("#logBtn");

// webcam constraints
const constraints = {
    audio: false,
    video: {
        width: 640,
        height: 360
    }
}

// init webcam stream
async function init(){
    try{
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    }
    catch(e){
        errorMsg.innerHTML = `navigator.getUserMedia.Error:${e.toString()}`;
    }
}

// attach stream to video and window object
const handleSuccess = (stream) => {
    window.stream = stream;
    video.srcObject = stream;
}

// initialize webcam stream
init();

// Capturing the image then firing the POST request
let context = canvas.getContext('2d');
snap.addEventListener("click", () => {

    // rendering loading animation
    const loader = document.querySelector('.future-loader');
    loader.classList.add('loader');

    // drawing webcam image on canvas then converting base64 string to base64 then blob
    document.querySelector('#cutie').style.display = "";
    context.drawImage(video, 0, 0, 640, 480);
    let imgData = canvas.toDataURL('image/jpeg');

    // send b64 image to API
    createEncoding(imgData).then(response => {

        response.json().then(responseObj => {

            handleEncodingResponse(responseObj);

        }).catch(error => {
            console.log(error);
            const errorContainer = document.querySelector('#errorMsg');
            errorContainer.innerText = "A server error occured; try again.";
        });

    }).catch(error => {
        console.log(error);
        const errorContainer = document.querySelector('#errorMsg');
        errorContainer.innerText = "A server error occured; try again.";
    });
});


// Setting up the log in button
logInBtn.addEventListener('click', () => {
    window.location.href = "http://127.0.0.1:8000/userAuth/login";
})