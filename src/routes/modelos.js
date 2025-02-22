const express = require("express");
const router = express.Router();
const { Marca, Modelo } = require("../models");
const validate = require("../middlewares/validate")
const { modeloSchema } = require('../validators/modelo.validator');

// BUSCAR TODOS OS MODELOS
router.get("", async (req, res, next) => {
    try {
        const modelos = await Modelo.findAll({
            order: [['nome', 'ASC']]
        })
        res.send(modelos)
    } catch (error) {
        next(error)
    }
});

// CRIAR MODELO
router.post("", validate(modeloSchema), async (req, res, next) => {
    const { nome, id_marca } = req.body;
    try {
        const modeloExistente = await Modelo.findOne({
            where: { nome, id_marca },
        });
        if (modeloExistente) {
            return res.status(400).json({ error: 'Esse modelo já existe.' });
        }
        const novoModelo = await Modelo.create({ nome, id_marca });
        return res.status(201).json(novoModelo);
    } catch (error) {
        next(error)
    }
});

module.exports = router;

