const express = require("express");
const router = express.Router();
const { TipoVeiculo, Marca } = require("../models");

// BUSCAR TODOS OS TIPOS DE VEÍCULOS
router.get("", (req, res, next) => {
  TipoVeiculo.findAll().then((tipos) => {
    res.send(tipos)
  }).catch(error => {
    next(error)
  })
});

// Rota para buscar marcas associadas a um tipo de veículo específico
router.get("/:tipoId/marcas", async (req, res) => {
  const { tipoId } = req.params;

  try {
    const marcas = await Marca.findAll({
      where: { id_tipo_veiculo: tipoId }
    });

    if (marcas.length === 0) {
      return res.status(404).json({ mensagem: "Tipo de veículo não encontrado." });
    }

    res.status(200).json(marcas);
  } catch (error) {
    console.error("Erro ao buscar marcas:", error);
    res.status(500).json({ mensagem: "Erro ao buscar marcas" });
  }
});

// CRIAR TIPO DE VEÍCULO
router.post("", async (req, res, next) => {
  const { nome } = req.body;
  
  try {
    const tipoExistente = await TipoVeiculo.findOne({ where: { nome } });
    if (tipoExistente) {
      return res.status(400).json({ error: 'Esse tipo de veículo já existe.' });
    }
    const novoTipo = await TipoVeiculo.create({ nome });
    return res.status(201).json(novoTipo);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
