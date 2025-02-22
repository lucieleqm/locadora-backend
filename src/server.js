require('dotenv').config();
const { clerkMiddleware, requireAuth, getAuth } = require('@clerk/express')

const express = require('express');
require('express-async-errors');
const cors = require("cors");
const iniciarCronJobs = require("./cronJobs");
const authMiddleware = require('./middlewares/authMiddleware')
const errorHandler = require('./middlewares/errorHandler');
const adminRoutes = require('./routes/admin')

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const dataHoraAtual = new Date();
console.log(`Servidor iniciado em: ${dataHoraAtual.toLocaleString()}`);

// Cron job
iniciarCronJobs();

// -- MIDDLEWARES -- //

// AUTHENTICATION MIDDLEWARE
// app.use(clerkMiddleware())

// ADMIN ROUTES (Before public Routes)
app.use(
  "/admin",
  requireAuth(),
  authMiddleware,
  //checkRoles("admin"),       
  adminRoutes              
);

// API ROUTES
const apiRoutes = require('./routes/index')
app.use('/', apiRoutes);

app.use('/uploads', express.static('uploads'));


// ERROR HANDLER MIDDLEWARE (Last middleware to use)
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});



