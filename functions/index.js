require("dotenv").config();

const promise = require("request-promise");
// const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");

initializeApp();

exports.verify = onRequest({cors: true}, (req, res) => {
  const response = req.body.data;
  promise({
    uri: "https://recaptcha.google.com/recaptcha/api/siteverify",
    method: "POST",
    formData: {
      secret: process.env.SECRET_KEY,
      response: response,
    },
    json: true,
  })
      .then((result) => {
        if (result.success) {
          res.send({data: {pass: true}});
        } else {
        //   logger.info(result, {structuredData: true});
          res.send({data: {pass: false, reason: result["error-codes"]}});
        }
      })
      .catch((reason) => {
        // logger.info(reason, {structuredData: true});
        res.send({data: reason});
      });
});

