const cron = require("node-cron")
const { Pagamento } = require("../models");
const { Op } = require("sequelize");

// Atualizar pagamentos vencidos
async function atualizarPagamentosVencidos() {
    try {
        const dataAtual = new Date();

        const pagamentosVencidos = await Pagamento.findAll({
            where: {
                dt_vencimento: { [Op.lt]: dataAtual },
                status: "pendente",
            }
        })

        const updates = pagamentosVencidos.map(pagamento => {
            const { novoValor, multaAplicada, jurosAcumulados } = pagamento.calcularNovoValor();

            return pagamento.update({
                status: "vencida",
                novo_valor: novoValor,
                multa_aplicada: multaAplicada,
                juros_acumulados: jurosAcumulados
            });
        });

        await Promise.all(updates);

    } catch (error) {
        console.error("Erro ao atualizar pagamentos vencidos:", error);
    }

}

cron.schedule("0 0 * * *", () => {
    console.log("Executando cron job para verificar pagamentos vencidos...");
    atualizarPagamentosVencidos();
})

module.exports = atualizarPagamentosVencidos;