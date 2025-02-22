'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tb_marca', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      id_tipo_veiculo: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tb_tipo_veiculo',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
  
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_marca');
  }
};
