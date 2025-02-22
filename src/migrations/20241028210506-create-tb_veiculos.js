'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_veiculo', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_tipo_veiculo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_tipo_veiculo',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      placa: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
      },
      renavam: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true
      },
      chassi: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      motor: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      ano: {
        type: Sequelize.STRING(4),
        allowNull: false
      },
      valor: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
     /* intervalo_valor: {
        type: Sequelize.STING(20),
        allowNull: false
      },*/
      km: {
        type: Sequelize.FLOAT,
        allowNull: true,
        default: 0
      },
      isLocado: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        default: false
      },
      id_modelo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_modelo',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      id_combustivel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_combustivel',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      id_cor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_cor',
          key: 'id'
        },
        onDelete: 'RESTRICT',
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
    await queryInterface.dropTable('tb_veiculo');
  }
};
