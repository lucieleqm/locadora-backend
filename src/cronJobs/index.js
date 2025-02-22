const marcarLocacaoParaRenovar = require("./locacaoCron");
const atualizarPagamentosVencidos = require("./pagamentoCron");

const iniciarCronJobs = () => {
  atualizarPagamentosVencidos();
  marcarLocacaoParaRenovar();
  console.log("Cron jobs inicializados com sucesso!");
};

module.exports = iniciarCronJobs;