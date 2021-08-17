const axios = require("axios");
const Encryptor = require('../lib/encryption');
const { CREDENTIALS_API } = require('./../constants');

const Promise = global.Promise;

class CredentialController {
    // Get all users
    static getAllCredentials(auth) {
        return new Promise((resolve, reject) => {
            var config = {
                method: 'get',
                url: `${CREDENTIALS_API}/credentials?checkOutEnabled=true&skipRecords=0&takeRecords=100`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Encryptor.decrypt(auth.token)
                        // 'Authorization': process.env.API_TOKEN
                },
                responseType: 'json', // default
            };

            axios(config)
                .then(function(response) {
                    resolve(response.data)
                })
                .catch(function(error) {
                    // resolve(mock)
                    reject(error)
                });

        })

    }


    // checkout Credentials
    static checkOutCredential(credInfo, auth) {
        return new Promise((resolve, reject) => {
            var config = {
                method: 'post',
                url: `${CREDENTIALS_API}/credentials/${credInfo.id}/check-out`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Encryptor.decrypt(auth.token)
                },
                responseType: 'json', // default
                data: credInfo.comment ? credInfo.comment : "None"
            };

            axios(config)
                .then(function(response) {
                    resolve(response.data)
                })
                .catch(function(error) {
                    reject(error)
                });

        })
    }

    // checkin Credentials
    static checkInCredential(credInfo, auth) {
        return new Promise((resolve, reject) => {
            var config = {
                method: 'post',
                url: `${CREDENTIALS_API}/credentials/${credInfo.id}/check-in`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Encryptor.decrypt(auth.token)
                },
                responseType: 'json', // default
                data: credInfo.comment ? credInfo.comment : "None"
            };

            axios(config)
                .then(function(response) {
                    resolve(response.data)
                })
                .catch(function(error) {
                    reject(error)
                });

        })
    }

    static queryCredentials(queryString, auth) {
        return new Promise((resolve, reject) => {
            var config = {
                method: 'get',
                url: `${CREDENTIALS_API}/credentials?checkOutEnabled=true&searchText=${queryString}&start=0&limit=10`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Encryptor.decrypt(auth.token)
                },
            };
            axios(config)
                .then(function(response) {
                    resolve(response.data)
                })
                .catch(function(error) {
                    reject(error)
                });

        })
    }
}
module.exports = CredentialController;