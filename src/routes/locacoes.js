const express = require("express");
const router = express.Router();
const { Locacao, ImagemLocacao, Cliente, Veiculo, Modelo, Marca, Pagamento, PoliticaFinanceira } = require("../models");
const upload = require('../config/multer');
const moment = require('moment-timezone');

// Buscar Locacoes
router.get("", async (req, res, next) => {
    Locacao.findAll({
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: Cliente,
                attributes: ['nome']
            }, {
                model: Veiculo, attributes: ['placa'],
                include: [{
                    model: Modelo, attributes: ['nome'],
                    as: "modelo",
                    include: [{
                        model: Marca,
                        attributes: ['nome'],
                        as: "marca"
                    }]
                }
                ]
            }, {
                model: Pagamento,
                as: 'pagamento',
                attributes: ['dt_vencimento', 'status', 'novo_valor', 'num_parcela']
            }
        ]
    }).then((locacoes) => {
        res.send(locacoes)
    }).catch(err => {
        next(err)
    })
});


// Buscar Locacao por Id
router.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        const locacao = await Locacao.findOne({
            where: { id },
            include: [
                {
                    model: ImagemLocacao, attributes: ['id', 'url']
                }, {
                    model: Cliente, attributes: ['nome', 'cpf', 'telefone1', 'telefone2']
                }, {
                    model: Veiculo, attributes: ['placa'],
                    include: [{
                        model: Modelo,
                        as: "modelo",
                        attributes: ['nome'],
                        include: [{
                            model: Marca,
                            as: "marca",
                            attributes: ['nome']
                        }]
                    }]
                }]
        });
        if (!locacao) {
            return res.status(404).json({ error: 'Locação não encontrada' });
        }
        res.json(locacao);
    } catch (error) {
        next(error)
    }
});

// BUSCAR PAGAMENTOS DE UM LOCAÇÃO
router.get("/:locacaoId/pagamentos", async (req, res, next) => {
    const { locacaoId } = req.params;

    try {
        const pagamentos = await Pagamento.findAll({
            where: { id_locacao: locacaoId }
        })

        if (pagamentos.length === 0) {
            return res.status(404).json({ mensagem: 'Não há pagamentos para essa locação' });
        }

        res.json(pagamentos)
    } catch (error) {
        next(error)
    }
});


// Buscar Locacoes de um veiculo
router.get("/veiculo/:veiculoId", async (req, res, next) => {
    const veiculoId = Number(req.params.veiculoId);
    console.log('Recebido no backend:', veiculoId);
    Locacao.findAll({
        where: { id_veiculo: veiculoId },
        include: [{
            model: ImagemLocacao,
            attributes: ['id', 'url']
        }, {
            model: Cliente,
            attributes: ['nome', 'cpf', 'telefone1', 'telefone2']
        }, {
            model: Veiculo,
            attributes: ['placa'],
            include: [{
                model: Modelo,
                attributes: ['nome'],
                include: [{
                    model: Marca,
                    attributes: ['nome']
                }]
            }]
        }]
    }).then((locacoes) => {
        res.send(locacoes)
    }).catch(err => {
        next(err)
    })
});

// Buscar Locacoes de um cliente
router.get("/cliente/:clienteId", async (req, res, next) => {
    const clienteId = Number(req.params.clienteId);
    console.log('Recebido no backend:', clienteId);
    Locacao.findAll({
        where: { id_cliente: clienteId },
        include: [{
            model: ImagemLocacao,
            attributes: ['id', 'url']
        }, {
            model: Cliente,
            attributes: ['nome', 'cpf', 'telefone1', 'telefone2']
        }, {
            model: Veiculo,
            attributes: ['placa'],
            include: [{
                model: Modelo,
                attributes: ['nome'],
                include: [{
                    model: Marca,
                    attributes: ['nome']
                }]
            }]
        }]
    }).then((locacoes) => {
        res.send(locacoes)
    }).catch(err => {
        next(err)
    })
});


// Listar Locacoes Que Podem Ser Renovadas
// router.get("/pode-renovar", async (res, next) => {
//     try {
//         const locacoes = await Locacao.findAll({
//             where: { pode_renovar: true, status: "ativa" },
//         });

//         res.json(locacoes);
//     } catch (error) {
//         next(error)
//     }
// })

// Renovar Locação
router.post("/renovar/:id", async (req, res, next) => {
    const locacaoId = req.params.id;

    const {
        dt_inicio,
        dt_final,
        caucao, // posso modificar
        valor_locacao, // posso modificar
        num_parcela, // posso
    } = req.body;

    try {
        const t = await Locacao.sequelize.transaction();
        // Busca a locacao original
        const locacao = await Locacao.findByPk(locacaoId, { transaction: t });
        if (!locacao || !locacao.pode_renovar) {
            return res.status(404).json({ error: "Locação não encontrada ou não está pronta para renovação" })
        }

        const dt_inicio_ajustada = moment.tz(dt_inicio, 'UTC').startOf('day').toDate();
        const dt_final_ajustada = moment.tz(dt_final, 'UTC').endOf('day').toDate();

        // const nova_dt_inicio = moment.tz(dt_final, 'UTC').startOf('day').toDate();
        // const nova_dt_termino = moment.tz(nova_dt_termino).add(1, 'month').endOf('day').toDate();


        // Buscar os dados da política financeira
        const politica = await PoliticaFinanceira.findOne({ where: { id: politica_financeira }, transaction: t });
        if (!politica) {
            throw new Error('Política financeira não encontrada');
        }
        const { juros, multa } = politica;

        const valorTotal = (Number(valor_locacao) + Number(caucao));

        const novaLocacao = await Locacao.create({
            id_cliente: locacao.id_cliente,
            id_veiculo: locacao.id_veiculo,
            dt_inicio: dt_inicio_ajustada,
            dt_final: dt_final_ajustada,
            caucao,
            valor_locacao: valorTotal,
            num_parcela,
        }, { transaction: t })

        // Gerar Parcelas
        const ValorParcela = valor_locacao / num_parcela
        const pagamentos = []

        for (let i = 0; i < num_parcela; i++) {
            const dataVencimento = moment.tz(dt_inicio, 'UTC').endOf('day').toDate();
            // Vencimentos semanais, sendo a primeira parcela 7 dias após a dt_inicio
            dataVencimento.setDate(dataVencimento.getDate() + (i + 1) * 7);

            pagamentos.push({
                id_locacao: novaLocacao.id,
                num_parcela: i + 1, // "i + 1" para que a primeira parcela n seja numerada como "0"
                total_parcelas: num_parcela,
                valor_parcela: ValorParcela,
                dt_vencimento: dataVencimento,
                juros: juros,
                multa: multa
            });
        }

        locacao.status = "inativa" // atualiza o staus
        locacao.pode_renovar = false;
        await locacao.save({ transaction: t });

        await t.commit();

        res.json(novaLocacao);
    } catch (error) {
        await t.rollback();
        next(error)
    }
})


// Rota para Cadastrar a Locacao
router.post("", upload.array('imagens'), async (req, res, next) => {
    const t = await Locacao.sequelize.transaction();

    const {
        placaVeiculo,
        cpfCliente,
        dt_inicio,
        dt_final,
        caucao,
        valor_locacao,
        politica_financeira,
        num_parcela, // num parcelas
    } = req.body;

    try {
        // VALIDAÇÃO DO CLIENTE
        const cliente = await Cliente.findOne({
            where: { cpf: cpfCliente },
            transaction: t
        });
        if (!cliente) {
            throw new Error('Cliente não encontrado');
        }
        if (cliente.isBan) {
            throw new Error('Cliente está banido e não pode realizar locações');
        }
        const id_cliente = cliente.id;

        // VALIDAÇÃO DO VEÍCULO
        const veiculo = await Veiculo.findOne({
            where: { placa: placaVeiculo },
            transaction: t
        });
        if (!veiculo) {
            throw new Error('Veículo não encontrado');
        }
        if (veiculo.isLocado) {
            throw new Error('Veículo já está locado no momento');
        }
        const id_veiculo = veiculo.id;

        // Buscar os dados da política financeira
        const politica = await PoliticaFinanceira.findOne({ where: { id: politica_financeira }, transaction: t });
        if (!politica) {
            throw new Error('Política financeira não encontrada');
        }
        const { juros, multa } = politica;

        // valores sao passados sem formatacao, dividir por 100. Separa a parte dos centavos
        const valorLocacao = valor_locacao / 100
        const valorCaucao = caucao / 100
        const valorTotal = valorLocacao + valorCaucao

        const dt_inicio_ajustada = moment.tz(dt_inicio, 'UTC').startOf('day').toDate();
        const dt_final_ajustada = moment.tz(dt_final, 'UTC').endOf('day').toDate();

        // Cria a Locacão
        const novaLocacao = await Locacao.create({
            id_veiculo,
            id_cliente,
            dt_inicio: dt_inicio_ajustada,
            dt_final: dt_final_ajustada,
            caucao: valorCaucao,
            valor_locacao: valorLocacao,
            valor_total: valorTotal,
        }, { transaction: t });

        // Gerar Parcelas
        const ValorParcela = valorLocacao / num_parcela
        const pagamentos = []

        for (let i = 0; i < num_parcela; i++) {
            const dataVencimento = moment.tz(dt_inicio, 'UTC').endOf('day').toDate();
            // Vencimentos semanais, sendo a primeira parcela 7 dias após a dt_inicio
            dataVencimento.setDate(dataVencimento.getDate() + (i + 1) * 7);

            pagamentos.push({
                id_locacao: novaLocacao.id,
                num_parcela: i + 1, // "i + 1" para que a primeira parcela n seja numerada como "0"
                total_parcelas: num_parcela,
                valor_parcela: ValorParcela,
                dt_vencimento: dataVencimento,
                juros: juros,
                multa: multa
            });
        }

        // Veiculo n pode mais ser locado
        await veiculo.update({
            isLocado: true
        }, { transaction: t })

        await Pagamento.bulkCreate(pagamentos, { transaction: t })

        // Manipulação das imagens
        const imagens = req.files.map((file) => ({
            id_locacao: novaLocacao.id,
            url: `uploads/${file.filename}`
        }));

        await ImagemLocacao.bulkCreate(imagens, { transaction: t });

        await t.commit();

        res.status(201).json({ locacao: novaLocacao, pagamentos });
    } catch (error) {
        await t.rollback();
        next(error)
    }
});


//Excluir Locacao
router.delete("/:id", async (req, res, next) => {
    const { id } = req.params;
    const t = await Locacao.sequelize.transaction();

    try {
        const locacao = await Locacao.findOne({
            where: { id },
            transaction: t
        });

        if (!locacao) {
            await t.rollback();
            return res.status(404).json({ mensagem: 'Locação não encontrada' });
        }

        const veiculoId = locacao.id_veiculo;

        await locacao.destroy({ transaction: t });

        // Desloca o veiculo
        if (veiculoId) {
            await Veiculo.update({
                isLocado: false
            }, {
                where: { id: veiculoId },
                transaction: t
            });
        }
        await t.commit();

        res.status(200).json({ mensagem: 'Locação deletada com sucesso!' });
    } catch (error) {
        await t.rollback();
        next(error)
    }
});

router.get("/:id/relatorio", async (req, res, next) => {
    const { id } = req.params;
    console.log("ID recebido:", id);
  
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
  
    try {
      const locacao = await Locacao.findByPk(id, {
        include: [
          { model: Cliente },
          { model: Veiculo },
          { model: Pagamento, as: 'pagamento'},
        ],
      });
  
      if (!locacao) {
        return res.status(404).json({ message: 'Locação não encontrada' });
      }
  
      const relatorio = {
        locacao: {
          id: locacao.id,
          dt_inicio: locacao.dt_inicio,
          dt_final: locacao.dt_final,
          status: locacao.status,
        },
        cliente: {
          nome: locacao.Cliente.nome,
          cpf: locacao.Cliente.cpf,
          telefone: locacao.Cliente.telefone,
        },
        veiculo: {
          modelo: locacao.Veiculo.modelo,
          placa: locacao.Veiculo.placa,
          cor: locacao.Veiculo.cor,
        },
        pagamentos: locacao.pagamento.map(p => ({
          num_parcela: p.num_parcela,
          valor_parcela: p.valor_parcela,
          status: p.status,
          dt_pagamento: p.dt_pagamento,
        })),
        total_pago: locacao.pagamento
          .filter(p => p.status === 'paga')
          .reduce((total, p) => total + p.valor_parcela, 0),
        saldo_pendente: locacao.pagamento
          .filter(p => p.status !== 'paga')
          .reduce((total, p) => total + p.valor_parcela, 0),
      };
  
      res.status(200).json(relatorio);
    } catch (error) {
      console.error("Erro ao buscar locação:", error);
      next(error);
    }
  });

module.exports = router;
