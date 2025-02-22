'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tb_politica_financeira', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      descricao: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      multa: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        //default: 0
      },
      juros: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        //default: 1
      },
      isAtiva: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_politica_financeira');
  }
};
