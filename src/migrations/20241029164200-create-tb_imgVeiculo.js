'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tb_img_veiculo', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      id_veiculo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_veiculo',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }  
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_img_veiculo');
  }
};
