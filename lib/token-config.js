"use strict";

const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_EXPIRATION_TIME, TOKEN_SECRET_KEY } = require('../constants');

const Promise = global.Promise;

async function generateToken(payLoad) {
    try {
        return await jwt.sign(payLoad, TOKEN_SECRET_KEY, {
            algorithm: "HS256",
            expiresIn: Number(ACCESS_TOKEN_EXPIRATION_TIME),
        });
    } catch (err) {
        // JWT TOKEN sign failed
    }
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, TOKEN_SECRET_KEY, (error, decoded) => {
            if (error) {
                reject(error);
            }
            resolve(decoded);
        });
    });
}

module.exports = {
    verifyToken,
    generateToken
}