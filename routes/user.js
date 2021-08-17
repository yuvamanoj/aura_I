var express = require('express');
const UserController = require('../controllers/userController');

var router = express.Router();

router.get('/byId', async(req, res) => {
    let result;
    try {
        result = await UserController.getUserById(req.query.id);
        res.send(result)
    } catch (error) {
        res.status(error.response.status).send(error.response.statusText)
    }
})

router.get('/profile', async(req, res) => {
    let result;
    try {
        result = await UserController.getUserByName(req.user);
        res.send(result)
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.statusText)
        } else {
            res.status(500).send("Failed")
        }

    }
})

module.exports = router;