var express = require('express');
var router = express.Router();

const logger = require('../lib/logger');
const CredentialController = require('../controllers/credentialController');

router.get('/', async(req, res) => {
    let result;
    try {
        result = await CredentialController.getAllCredentials(req.user);
        res.send(result)
    } catch (error) {
        logger.error(`[${req.user.username}]-[${req.method}]-[${req.url}]-${JSON.stringify(error)}`)
        if (error.response) {
            res.status(error.response.status).send(error.response.statusText)
        } else {
            res.status(500).send("Unable to Fetch Credentials")
        }

    }

});

router.post('/checkout', async(req, res) => {
    let result;
    try {
        result = await CredentialController.checkOutCredential(req.body, req.user);
        res.send(result)
    } catch (error) {
        res.status(error.response.status).send(error.response.statusText)
    }
});

router.post('/checkin', async(req, res) => {
    let result;
    try {
        result = await CredentialController.checkInCredential(req.body, req.user);
        res.send(result)
    } catch (error) {
        res.status(error.response.status);
        if (error.response && error.response.data) {
            res.json(error.response.data);
        } else {
            res.send(error.response.statusText)
        }

    }
})

router.get('/search', async(req, res) => {
  console.log(req.query.searchText);
    let result;
    try {
        result = await CredentialController.queryCredentials(req.query.searchText, req.user);
        res.send(result)
    } catch (error) {
        console.log("Could not query credentials :", error.reason);
        if (error.response) {
            res.status(error.response.status).send(error.response.statusText)
        } else {
            res.status(500).send("Unable to Query Credentials")
        }

    }
})

module.exports = router;