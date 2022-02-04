const express = require("express");
const router =  express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json())

router.get('/', basicRoute)

function basicRoute(req, res) {
    let result = {"status": "more to come..."}

    res.status(200).send(result)
}

// EXPORT
module.exports = router