const express = require('express')
const apiRouter = express.Router();

const clientesRoutes = require("./clientes");
// const coresRoutes = require("./cores");
const tiposVeiculosRoutes = require("./tipos_veiculos");
const marcasRoutes = require("./marcas");
const modelosRoutes = require("./modelos");
const combustiveisRoutes = require("./combustiveis");
const veiculosRoutes = require("./veiculos");
const reparosRoutes = require("./reparos");
const locacoesRoutes = require("./locacoes");
const pagamentosRoutes = require("./pagamentos");
const blacklistsRoutes = require("./blacklists");
const politicasFinanceirasRoutes = require("./politicasfinanceiras");
//const adminRoutes = ("./admin")

apiRouter.use('/clientes', clientesRoutes)
// apiRouter.use("/cores", coresRoutes);
apiRouter.use("/tipos", tiposVeiculosRoutes);
apiRouter.use("/marcas", marcasRoutes);
apiRouter.use("/modelos", modelosRoutes);
apiRouter.use("/combustiveis", combustiveisRoutes);
apiRouter.use("/veiculos", veiculosRoutes);
apiRouter.use("/reparos", reparosRoutes);
apiRouter.use("/locacoes", locacoesRoutes);
apiRouter.use("/pagamentos", pagamentosRoutes);
apiRouter.use("/blacklists", blacklistsRoutes);
apiRouter.use("/politicas_financeiras", politicasFinanceirasRoutes);
//apiRouter.use("/admin", adminRoutes);

module.exports = apiRouter;