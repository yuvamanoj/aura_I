var express = require('express');
const path = require('path');
const AuthController = require('../controllers/authenticate.js');
// const Validator = require('../lib/token-config');
var router = express.Router();

// Main page requires an authenticated user    
router.get("/",
    function(req, res) {
        res.sendFile(path.join(__dirname, `../${process.env.APP_DIRECTORY || "client/build"}/${process.env.HTML_INDEX || "index.html"}`)); 
    }
);

/* POST Login */
router.post('/login', async (req, res) => {
  const cred = req.body;
  try {
    const result = await AuthController.authenticate(cred);
    res.send(result)
  } catch (error) {
    if(error.response){
      res.status(error.response.data.code || 504).send(error.response.data.message || error.response.statusText)
    } else {
      res.status(500).send('Failed')
    }
   
  }

});

router.get('/auth', AuthController.validateAuthorization, AuthController.authorize)

module.exports = router;