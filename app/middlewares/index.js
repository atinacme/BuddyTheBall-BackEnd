const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const upload = require("./upload");
const sendEmail = require("./sendEmailService")
const uploadFile = require("./uploadFile")

module.exports = {
    authJwt,
    verifySignUp,
    upload,
    sendEmail,
    uploadFile
};