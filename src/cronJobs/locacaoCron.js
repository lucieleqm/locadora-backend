const cron = require("node-cron");
const { Locacao } = require("../models");
const { Op  } = require("sequelize");
const Pagamento = require("../models/Pagamento");

async function marcarLocacaoParaRenovar() {
    try {
        const dataAtual = new Date();

        // Buscar locações ativas cuja data de término já passou
        const locacoes = await Locacao.findAll({
            where: {
                dt_final: { [Op.lt]: dataAtual }, 
                status: "ativa", 
                pode_renovar: false 
            }
        });

        // const podemRenovar = locacoes.map((locacao) => {
        //     Pagamento.findAll({
        //         where: {
        //             id_locacao: locacao.id,
        //             status: "paga"
        //         }
        //     })
        // })

        for (const locacao of locacoes) {
            locacao.pode_renovar = true;
            await locacao.save();
        }

        console.log(`${locacoes.length} locações marcadas para renovar`)
    } catch (error) {
        console.error("Erro ao marcar locações para renovação:", error);
    }
}

// Agendar o cron job para rodar diariamente à meia-noite
cron.schedule("0 0 * * *", () => {
    console.log("Executando cron job para verificar locações para renovar...");
    marcarLocacaoParaRenovar();
})

module.exports = marcarLocacaoParaRenovar;
