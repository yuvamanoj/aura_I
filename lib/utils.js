const btoa = require('btoa');

function credToToken(cred) {
return `${process.env.TOKEN_INITIALS} ` + btoa(`${cred.user}:${cred.password}`)
}

module.exports = {
    credToToken
}