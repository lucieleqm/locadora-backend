const express = require("express");
const router = express.Router();
const { Blacklist, Cliente } = require("../models");

// BUSCAR BAN BY ID
router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  Blacklist.findByPk(id, {
  }).then((ban) => {
    res.send(ban)
  }).catch(err => {
    next(err)
  })
});


// // Rota para deletar um infrator
// router.delete("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Blacklist.destroy({ where: { id } });

//     if (deleted) {
//       return res.status(200).json({ message: "Infrator deletado com sucesso!" });
//     } else {
//       return res.status(404).json({ error: "Infrator não encontrado" });
//     }
//   } catch (error) {
//     next(error)
//   }
// });

// Buscar Todos os Itens da Blacklist
router.get("", async (req, res, next) => {
  try{
    const bans = await Blacklist.findAll({
      order: [['createdAt','DESC']]
    })
    res.send(bans)
  }catch(error) {
    next(error)
  }
});

//CRIAR BAN
router.post("", async (req, res, next) => {
  const t = await Blacklist.sequelize.transaction();
  const { cpf, nome, motivo } = req.body;

  const cliente = await Cliente.findOne({
    where: { cpf }
  }) 

  if(cliente) {
    cliente.update({
      isBan: true
    }, { transaction: t })
  }

  try {
    
    const existingEntry = await Blacklist.findOne({ where: { cpf } });
    if (existingEntry) {
      return res.status(400).json({ error: 'CPF já está na blacklist.' });
    }

    const novoBan = await Blacklist.create({
      cpf,
      nome,
      motivo,
    }, { transaction: t });

    await t.commit();

    res.status(201).json(novoBan);
  } catch (error) {
    await t.rollback();
    next(error)
  }
});

// EDITAR BAN
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { cpf, nome, motivo } = req.body;

  try {
    const ban = await Blacklist.findByPk(id)
    if (!ban) {
      return res.status(404).json({ mensagem: 'Banimento não encontrado' });
    }
    await ban.update({
      cpf,
      nome,
      motivo,
    });

    res.status(201).json(ban);
  } catch (error) {
    next(error)
  }
});

// EXCLUIR BAN
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const t = await Blacklist.sequelize.transaction(); 

  try {
    const ban = await Blacklist.findByPk(id, { transaction: t })
    if(!ban) {
      return res.status(404).json({ mensagem: 'Banimento não encontrado' });
    }

    // Desbane o cliente
    const cpf = ban.cpf;
    await Cliente.update(
      { isBan: false }, 
      { where: { cpf }, transaction: t }
    );

    await ban.destroy({ transaction: t });
    await t.commit();
    res.status(200).json({ mensagem: 'Banimento deletado com sucesso!' });
  } catch (error) {
    await t.rollback();
    next(error);
  }
});

module.exports = router;
