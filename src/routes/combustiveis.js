const express = require("express");
const router = express.Router();
const { Combustivel } = require("../models");

router.get("", (req, res) => {
    Combustivel.findAll().then((combustiveis) => {
        res.send(combustiveis)
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    })   
});

module.exports = router;