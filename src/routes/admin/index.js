const express = require('express')
const adminRouter = express.Router();

const coresRoutes = require("../cores");

adminRouter.use("/cores", coresRoutes);

module.exports = adminRouter;
