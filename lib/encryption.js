"use strict";

var CryptoJS = require("crypto-js");

const SECRET = process.env.SECRET_KEY || "encrypt secret 123 key";


function encrypt(payload) {
    return CryptoJS.AES.encrypt(payload, SECRET).toString();
}

function decrypt(encrypted) {
    var bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = {
    encrypt,
    decrypt
}