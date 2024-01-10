/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
  response.send({"data": "hello world"});
});

/*

Google tutorials:

https://firebase.google.com/docs/functions/get-started?gen=2nd
https://firebase.google.com/docs/functions/callable?gen=2nd

ReCAPTCHA tutorial:

https://blog.logrocket.com/implement-recaptcha-react-application/

ReCAPTCHA set up:

https://www.google.com/recaptcha/admin/site/692789815/setup

site key = 6Lc3IkspAAAAABMFnfMr_Vm9WF6_EUhtqdhzaRfv
secret key = 6Lc3IkspAAAAAGC-r0fmuX6W34OQo9ZmyyOZivEt

// functions

firebase emulators:start

Emulator suite: http://127.0.0.1:4000/

/build is served at http://127.0.0.1:5002/

*/