const express = require("express");
const router = express.Router();
const { Cliente, Endereco, Blacklist } = require("../models");
const validate = require('../middlewares/validate');
const { criarClienteSchema } = require('../validators/cliente.validator');

// CRIA CLIENTE
router.post("", async (req, res, next) => {

  const {
    nome,
    estado_civil,
    profissao,
    rg,
    cpf,
    email,
    telefone1,
    telefone2,
    endereco,
  } = req.body;

  try {
    // Verificar se o CPF está na blacklist
    const cpfBloqueado = await Blacklist.findOne({
      where: { cpf }
    });

    if (cpfBloqueado) {
      return res.status(403).json({
        message: "Não é possível cadastrar cliente: CPF banido",
        motivo: cpfBloqueado.motivo
      });
    }

    const t = await Cliente.sequelize.transaction();

    const novoCliente = await Cliente.create({
      nome,
      estado_civil,
      profissao,
      rg,
      cpf,
      email,
      telefone1,
      telefone2,
    }, { transaction: t });

    // Cria endereco
    endereco.id_cliente = novoCliente.id
    const novoEndereco = await Endereco.create(endereco, { transaction: t })

    await t.commit();

    res.status(201).json({
      message: "Cliente cadastrado com sucesso!",
      cliente: novoCliente,
      endereco: novoEndereco
    });
  } catch (err) {
    await t.rollback();
    console.error("Erro ao cadastrar cliente e endereço:", err);
    next(err)
  }
});


// BUSCAR CLIENTES
router.get("", async (req, res, next) => {
  try {
    const clientes = await Cliente.findAll({
      order: [['createdAt', 'DESC']]
    })
    res.send(clientes)
  } catch (error) {
    next(error)
  }
});


// BUSCAR CLIENTE BY ID -> clientes/:id
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const cliente = await Cliente.findOne({
      where: { id },
      include: [{
        model: Endereco,
        as: "endereco",
      }]
    });
    res.json(cliente);
  } catch (error) {
    next(error);
  }
});

// BUSCAR CLIENTE BY CPF -> clientes/cpf/:cpf
router.get('/cpf/:cpf', async (req, res, next) => {
  try {
    const cliente = await Cliente.findOne({
      where: { cpf: req.params.cpf },
    });

    if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

    res.json({
      id: cliente.id,
      nome: cliente.nome,
      isBan: cliente.isBan
    });
  } catch (error) {
    next(error)
  }
});

// EDITAR CLIENTE
router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  const {
    nome,
    estado_civil,
    profissao,
    rg,
    cpf,
    email,
    telefone1,
    telefone2,
    endereco
  } = req.body;

  const t = await Cliente.sequelize.transaction();

  try {
    const cliente = await Cliente.findByPk(id, { include: [{ model: Endereco, as: 'endereco' }] });
    if (!cliente) {
      await t.rollback();
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    await cliente.update({
      nome,
      estado_civil,
      profissao,
      rg,
      cpf,
      email,
      telefone1,
      telefone2
    }, { transaction: t });

    // Atualiza endereço do cliente
    await cliente.endereco.update(endereco, { transaction: t })

    await t.commit();

    res.status(200).json({ mensagem: 'Cliente atualizado com sucesso!', cliente });
  } catch (error) {
    await t.rollback();
    next(error);
  }
});

// DELETAR CLIENTE
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const cliente = await Cliente.findByPk(id)
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    await cliente.destroy();
    res.status(200).json({ mensagem: 'Cliente deletado com sucesso!' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
