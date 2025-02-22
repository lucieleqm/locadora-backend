const express = require("express");
const router = express.Router();
const { Marca, Modelo } = require("../models");
const validate = require("../middlewares/validate")
const { marcaSchema } = require('../validators/marca.validator');

// BUSCAR TODAS AS MARCAS
router.get("", async (req, res, next) => {
  try{
    const marcas = await Marca.findAll({
      order: [['nome', 'ASC']]
    })
    res.send(marcas)
  }catch(error) {
    next(error)
  }
});

router.get("/:marcaId/modelos", async (req, res, next) => {
  const { marcaId } = req.params;

  try {
    const modelos = await Modelo.findAll({
      where: { id_marca: marcaId },
      as: 'marca',
      order: [['nome', 'ASC']]
    });

    if (modelos.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum modelo encontrado para esta marca." });
    }

    res.json(modelos);
  } catch (error) {
    next(error)
  }
});


// CRIAR MARCA
router.post("", validate(marcaSchema), async (req, res, next) => {
  const { nome, id_tipo_veiculo } = req.body;
 
  try {
    const marcaExistente = await Marca.findOne({ where: { nome, id_tipo_veiculo } });
    if (marcaExistente) {
      return res.status(400).json({ error: 'Essa marca já existe para esse tipo de veículo.' });
    }
    const novaMarca = await Marca.create({ nome, id_tipo_veiculo });
    return res.status(201).json(novaMarca);
  } catch (error) {
    next(error)
  }
});



module.exports = router;