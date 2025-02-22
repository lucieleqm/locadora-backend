'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tb_pagamento', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      num_parcela: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total_parcelas: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      valor_parcela: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      dt_vencimento: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pendente', 'paga', 'vencida'),
        allowNull: false,
        defaultValue: 'pendente'
      },
      dt_pagamento: {
        type: Sequelize.DATE,
        allowNull: true
      },
      multa: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
      },
      juros: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 1
      },
      multa_aplicada: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      juros_acumulados: { 
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      novo_valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      id_locacao: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tb_locacao',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_pagamento');
  }
};
