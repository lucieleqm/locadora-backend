const express = require("express");
const router = express.Router();
const { Cor } = require("../models");
const validate = require("../middlewares/validate")
const { corSchema } = require('../validators/cor.validator');
const { requireAuth } = require('@clerk/express')

// BUSCAR TODAS AS CORES
router.get("", requireAuth(), (req, res, next) => {
    Cor.findAll().then((cores) => {
        res.send(cores)
    }).catch(error => {
        next(error)
    })
});

// CRIAR COR
router.post("", validate(corSchema), async (req, res, next) => {
    const { nome } = req.body;

    try {
        const corExistente = await Cor.findOne({
            where: { nome }
        });
        if (corExistente) {
            return res.status(400).json({ error: "Essa cor já existe." })
        }
        const novaCor = await Cor.create({ nome });
        return res.status(201).json(novaCor)
    } catch (error) {
        next(error)
    }
})

module.exports = router;
