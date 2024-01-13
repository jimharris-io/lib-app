require('dotenv').config();

const promise = require('request-promise');
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");

initializeApp();

// exports.helloWorld = onRequest((request, response) => {
//   logger.info(request.body.data, { structuredData: true });
//   response.send({ data: request.body.data });
// });

exports.verify = onRequest((req, res) => {
  const response = req.body.data
  promise({
      uri: 'https://recaptcha.google.com/recaptcha/api/siteverify',
      method: 'POST',
      formData: {
          secret: process.env.SECRET_KEY,
          response: response
      },
      json: true
  }).then(result => {
      if (result.success) {
          res.send({data: {pass: true}})
      }
      else {
          logger.info(result, { structuredData: true });
          res.send({data: {pass: false, reason: result['error-codes']}})
      }
  }).catch(reason => {
      logger.info(reason, { structuredData: true });
      res.send({data: reason})
  })
})

/*

Google tutorials:

https://firebase.google.com/docs/functions/get-started?gen=2nd
https://firebase.google.com/docs/functions/callable?gen=2nd

ReCAPTCHA tutorials:

https://blog.logrocket.com/implement-recaptcha-react-application/
https://firebase.blog/posts/2017/08/guard-your-web-content-from-abuse-with

ReCAPTCHA set up:

https://www.google.com/recaptcha/admin/site/692789815/setup

site key = 6Lc3IkspAAAAABMFnfMr_Vm9WF6_EUhtqdhzaRfv
secret key = 6Lc3IkspAAAAAGC-r0fmuX6W34OQo9ZmyyOZivEt

// functions

firebase emulators:start

Emulator suite: http://127.0.0.1:4000/

/build is served at http://127.0.0.1:5002/

*/
