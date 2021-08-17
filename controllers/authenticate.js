const axios = require("axios");
const Promise = global.Promise;
const Encryptor = require('../lib/encryption');
const Validator = require('../lib/token-config');
const logger = require('../lib/logger');
const Tokenization = require('../lib/token-config');
const utils = require('../lib/utils');
const { AUTHENTICATION_API_URL} = require('./../constants');

class Authentication {
    // Authenticate
    static authenticate(params) {
        const { user, password } = params;
        return new Promise((resolve, reject) => {
            var config = {
                method: 'post',
                url: `${AUTHENTICATION_API_URL}?user=${user}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'json', // default
                data: password,
            };
            axios(config).then(async (response) => {
                const encrypted = Encryptor.encrypt(utils.credToToken(params));
                const tokenObj = await Tokenization.generateToken({ username: user, token : encrypted });
                resolve({ success: response.data.rsp === 'ok' ? true : false, token: tokenObj })
            }).catch(function(error) {
                  reject(error)
            });
        })
    }

    static authorize(req, res) {
        req.user ? res.send({ success: true }) : res.send({ success: false });
      }

    
    static validateAuthorization(req, res, next) {
        if (req.headers.authorization && req.headers.authorization.indexOf('Bearer ') === 0) {
        req.user = null;
        const authHeader = req.headers.authorization;
        Validator.verifyToken(authHeader.split(" ")[1]).then(
            payload => {
            if (payload && payload.token) {
                req.user = payload;
                logger.info(`[${payload.username}]-[${req.method}]-[${req.url}]`)
                next();
            }
            }).catch(error => {
            res.status(401).send({ message: error.message });
            });
        } else {
            return res.status(401).json({ message: 'Unauthorized Request' });
        }
    }
   
}
module.exports = Authentication;