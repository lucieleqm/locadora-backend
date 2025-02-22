const express = require("express");
const router = express.Router();
const { Veiculo, Modelo, ImagemVeiculo, TipoVeiculo, Combustivel, Cor, Marca, Locacao, Sequelize } = require("../models");
const { ForeignKeyConstraintError } = Sequelize;
const upload = require('../config/multer');

// Buscar Veiculo[]
router.get('', async (req, res, next) => {
  /* const { search } = req.query;
 
   const where = {};
 
   if (search) {
     where.nome = { [Op.like]: `%${search}%` };
   }*/

  try {
    const veiculos = await Veiculo.findAll({
      order: [['createdAt', 'DESC']],
      /* where, 
       attributes: [ "placa", "locado"],*/
      include: [{
        model: Modelo,
        as: 'modelo',
        attributes: ['nome'],
        include: [{
          model: Marca,
          as: 'marca',
          attributes: ['nome']
        }]
      },
      {
        model: ImagemVeiculo,
        /*as: 'imagem_veiculo',*/
        attributes: ['url']
      }
      ],
    });
    res.json(veiculos);
  } catch (error) {
    console.error("Erro ao buscar veículos:", error);
    next(error)
  }
});


// Buscar Veiculo
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const veiculo = await Veiculo.findOne({
      where: { id },
      include: [{
        model: ImagemVeiculo,
        attributes: ['id', 'url']
      }, {
        model: Cor,
        as: 'cor',
        attributes: ['nome', 'id']
      }, {
        model: Combustivel,
        as: 'combustivel',
        attributes: ['nome', 'id']
      }, {
        model: Modelo,
        as: 'modelo',
        attributes: ['nome', 'id'],
        include: [{
          model: Marca,
          as: 'marca',
          attributes: ['nome', 'id'],
          include: [{
            model: TipoVeiculo,
            attributes: ['nome', 'id'],
            as: 'tipo'
          }]
        }]
      }
      ]
    });
    res.json(veiculo);
  } catch (error) {
    console.error("Erro ao buscar veiculo:", error);
    next(error)
  }
});


// GET VEÍCULO BY PLACA
router.get('/placa/:placa', async (req, res) => {
  const { placa } = req.params;
  try {
    const veiculo = await Veiculo.findOne({
      where: { placa },
      include: [{ 
        model: Modelo, 
        as: "modelo", 
        include: [{
          model: Marca,
          as: "marca"
        }] }],
    });
    if (!veiculo) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }
    res.json({
      id: veiculo.id,
      modelo: veiculo.modelo?.nome,
      marca: veiculo.modelo?.marca?.nome,
      isLocado: veiculo.isLocado
    });
  } catch (error) {
    console.error("Erro ao buscar veículo:", error);
    res.status(500).json({ error: 'Erro ao buscar veículo' });
  }
});


// Cadastrar Veiculo
router.post('', upload.array('imagens'), async (req, res, next) => {
  const t = await Veiculo.sequelize.transaction();
  const {
    id_tipo_veiculo,
    placa,
    renavam,
    chassi,
    motor,
    id_cor,
    ano,
    valor,
    id_modelo,
    id_combustivel,
  } = req.body;

  try {
    const novoVeiculo = await Veiculo.create({
      id_tipo_veiculo,
      placa,
      renavam,
      chassi,
      motor,
      id_cor,
      ano,
      valor,
      //disponibilidade,
      id_modelo,
      id_combustivel,
    }, { transaction: t });

    // Manipulação das imagens
    const imagens = req.files.map((file) => ({
      id_veiculo: novoVeiculo.id,
      url: `uploads/${file.filename}`
    }));

    // Cadastra Imagens
    await ImagemVeiculo.bulkCreate(imagens, { transaction: t });

    await t.commit();

    res.status(201).json({ mensagem: "Veículo e imagens cadastrados com sucesso!", veiculo: novoVeiculo });
  } catch (error) {
    await t.rollback();
    console.error("Erro ao cadastrar veículo e imagens:", error);

    // Verifica se o erro é de violação de chave estrangeira
    if (error instanceof ForeignKeyConstraintError) {
      return res.status(400).json({ mensagem: "Modelo ou combustível não encontrado." });
    }

    res.status(500).json({ mensagem: "Erro ao cadastrar o veículo." });
    next(error)
  }
});


// Deletar Veiculo
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const veiculo = await Veiculo.findOne({ where: { id } });
    if (!veiculo) {
      return res.status(404).json({ mensagem: 'Veículo não encontrado' });
    }

    const locacao = await Locacao.findOne({ where: { id_veiculo: id } });
    if (locacao) {
      return res.status(400).json({
        mensagem: 'Veículo não pode ser deletado, pois está vinculado a uma locação'
      });
    }

    await veiculo.destroy();
    res.status(200).json({ mensagem: 'Veículo deletado com sucesso!' });
  } catch (error) {
    console.error("Erro ao deletar veículo:", error);
    res.status(500).json({ mensagem: 'Erro ao deletar veículo' });
  }
});


// Edição de Veículo por ID
router.put('/:id', upload.array('imagens'), async (req, res, next) => {
  const { id } = req.params;
  const {
    id_tipo_veiculo,
    id_modelo,
    id_combustivel,
    id_cor,
    placa,
    renavam,
    chassi,
    motor,
    ano,
    valor,
    disponibilidade,
    //imagensRemovidas,
  } = req.body;

  const t = await Veiculo.sequelize.transaction();

  try {
    const veiculo = await Veiculo.findOne({ where: { id } });
    if (!veiculo) {
      await t.rollback();
      return res.status(404).json({ mensagem: 'Veículo não encontrado' });
    }

    await veiculo.update({
      id_tipo_veiculo,
      id_modelo,
      id_combustivel,
      id_cor,
      placa,
      renavam,
      chassi,
      motor,
      ano,
      valor,
    }, { transaction: t });

    // Deletar imagens antigas (se houver IDs fornecidos) 
    /* if (imagensRemovidas && imagensRemovidas.length > 0) {
       await ImagemVeiculo.destroy({
         where: { id: imagensRemovidas, id_veiculo: id },
         transaction: t
       });
     }*/

    // Adicionar novas imagens 
    if (req.files && req.files.length > 0) {
      const novasImagens = req.files.map((file) => ({
        id_veiculo: veiculo.id,
        url: `uploads/${file.filename}`
      }));

      await ImagemVeiculo.bulkCreate(novasImagens, { transaction: t });
    }

    await t.commit();
    res.status(200).json({ mensagem: 'Veículo atualizado com sucesso!', veiculo });
  } catch (error) {
    await t.rollback();
    next(error)
  }
});

module.exports = router;