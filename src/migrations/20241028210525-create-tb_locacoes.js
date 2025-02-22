'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_locacao', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      caucao: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      valor_locacao: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      valor_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      km: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM("ativa", "inativa", "renovada"),
        defaultValue: "ativa"
      },
      pode_renovar: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      dt_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dt_final: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      id_veiculo: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tb_veiculo',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      id_cliente: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tb_cliente',
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_locacao');
  }
};
