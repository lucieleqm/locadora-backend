const express = require("express");
const router = express.Router();
const { PoliticaFinanceira } = require("../models");

// CRIAR POLÍTICA FINANCEIRA
router.post("", async (req, res, next) => {
    const { multa, juros, descricao } = req.body;
    const valorMulta = parseInt(multa) / 100

     /* Pega o valor da multa e formata para Real */
    const multaFormatada = real.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })

    try {
        const novaPolitica = await PoliticaFinanceira.create({ 
            multa: valorMulta, 
            juros, 
            descricao: `Multa: ${multaFormatada} - Juros: ${juros}%`
        });
        return res.status(201).json(novaPolitica);
    } catch (error) {
        next(error)
    }
});

// BUSCAR POLÍTICA FINANCEIRA
router.get("", (req, res, next) => {
    PoliticaFinanceira.findAll()
        .then((politicas) => {
            res.send(politicas)
        }).catch(err => {
            next(err)
        })
});

// DELETAR POLÍTICA FINANCEIRA
router.delete("/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        const politica = await PoliticaFinanceira.findByPk(id);

        await politica.destroy();
        res.status(200).json({ mensagem: 'Política Financeira deletada com sucesso!' });
    } catch (error) {
        next(error)
    }
})

module.exports = router;

