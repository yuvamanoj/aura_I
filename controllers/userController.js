const axios = require("axios");
const { USER_API} = require('./../constants');

const Promise = global.Promise;

class UserController {

    // Get a single user
    static getUserById(id) {
        return new Promise((resolve, reject) => {
            var config = {
                method: 'get',
                url: `${USER_API}/byId?userId=${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': process.env.API_TOKEN
                },
                responseType: 'json', // default
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

    static getUserByName(auth) {
        return new Promise((resolve, reject) => {
            const name = String(auth.username).split('\\')[1] ? String(auth.username).split('\\')[1] : String(auth.username).split('\\')[0];
            var config = {
                method: 'get',
                url: `${USER_API}/byName?userName=${name}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': process.env.API_TOKEN
                },
                responseType: 'json', // default
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
module.exports = UserController;