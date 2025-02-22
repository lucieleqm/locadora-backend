const express = require("express");
const router = express.Router();
const moment = require('moment-timezone');
const { Pagamento, Locacao, Cliente, Veiculo } = require("../models");

router.get("", (req, res, next) => {
  Pagamento.findAll({
    include: [{
      model: Locacao,
      as: 'locacao',
      include: [{
        model: Cliente,
        attributes: ['nome', 'cpf']
      }, {
        model: Veiculo,
        attributes: ['placa'],
      }]
    }]
  }).then((pagamentos) => {
    res.send(pagamentos)
  }).catch(err => {
    next(err)
  })
});

// BUSCAR PAGAMENTO BY ID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const pagamento = await Pagamento.findOne({
      where: { id },
    });
    res.json(pagamento);
  } catch (error) {
    next(error);
  }
});

// MARCAR PARCELA COMO PAGA
router.patch("/:id/mark-as-paid", async (req, res, next) => {
  const { id } = req.params;

  const hoje = moment.tz('UTC').format();

  try {
    const pagamento = await Pagamento.findByPk(id);
    // , {where: {status: "pendente" || "vencida"}}
    if (!pagamento) {
      return res.status(404).json({ message: "Parcela não encontrada" });
    }
    await pagamento.update({ 
      status: "paga",
      dt_pagamento: hoje
    });

    return res.status(200).json({ message: "Parcela marcada como paga" });
  } catch (error) {
    next(error)
  }
});



module.exports = router;