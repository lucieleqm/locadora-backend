'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tb_review', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      estrelas: {
        type: Sequelize.FLOAT,
        allowNull: false,
        default: 0,
        validate: {
          min: 0,
          max: 5
        }
      },
      comentario: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      id_locacao: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('tb_review');
  }
};
