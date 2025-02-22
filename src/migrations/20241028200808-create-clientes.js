'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_cliente', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      estado_civil: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      profissao: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      rg: {
        type: Sequelize.STRING(13),
        allowNull: false,
        unique: true,
      },
      cpf: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
        validate: {
          isEmail: true
        }
      },
      telefone1: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      telefone2: {
        type: Sequelize.STRING(15),
        allowNull: true
      },
      isBan: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_cliente');
  }
};
