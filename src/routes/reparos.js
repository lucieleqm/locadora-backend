const express = require("express");
const router = express.Router();
const { Reparo, Veiculo, Modelo, Marca } = require("../models");

// Buscar Todos os Reparos
router.get("", (req, res, next) => {
    Reparo.findAll({
        include: [{
            model: Veiculo,
            attributes: ['placa'],
            include: [{
                model: Modelo,
                attributes: ['nome'],
                as: 'modelo',
                include: [{
                    model: Marca,
                    attributes: ['nome'],
                    as: 'marca'
                }
                ]
            }
            ]
        }]
    }).then((reparos) => {
        res.send(reparos)
    }).catch(err => {
        next(err)
    })
});


// BUSCAR REPARO BY ID 
router.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        const reparo = await Reparo.findByPk(id);
        res.json(reparo);
    } catch (error) {
        next(error);
    }
});


// Buscar reparos de um veículo
router.get("/veiculos/:veiculoId", (req, res, next) => {
    const veiculoId = Number(req.params.veiculoId);
    Reparo.findAll({
        where: { id_veiculo: veiculoId },
    }).then((reparos) => {
        res.send(reparos)
    }).catch(err => {
        next(err)
    })
});

// CRIAR REPARO
router.post("/:id_veiculo", async (req, res, next) => {
    const { id_veiculo } = req.params;
    const { descricao, data, custo } = req.body;

    try {
        const novoReparo = await Reparo.create({
            descricao,
            data,
            custo,
            id_veiculo,
        });

        res.status(201).json(novoReparo);
    } catch (error) {
        next(error)
    }
});

// EDITAR REPARO
router.patch("/:id", async (req, res, next) => {
    const { id } = req.params;
    const { descricao, data, custo, id_veiculo } = req.body;
    try {
        const reparo = await Reparo.findByPk(id);
        if (!reparo) {
            return res.status(404).json({ mensagem: 'Reparo não encontrado' });
        }

        await reparo.update({
            descricao,
            data,
            custo,
            id_veiculo,
        });

        res.status(200).json(reparo);
    } catch (error) {
        next(error)
    }
});

// DELETAR REPARO
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const reparo = await Reparo.findByPk(id);
    if (!reparo) {
        return res.status(404).json({ mensagem: 'Reparo não encontrado' });
    }

    await reparo.destroy();
    res.status(200).json({ mensagem: 'Reparo deletado com sucesso!' });
  } catch (error) {
    next(error)
  }
});

module.exports = router;