'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tb_tipo_veiculo', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },  
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_tipo_veiculo');
  }
};
