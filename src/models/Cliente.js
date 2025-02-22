module.exports = (sequelize, Sequelize) => {
  const Cliente = sequelize.define("Cliente", {
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
    }

  }, {
    tableName: "tb_cliente",
    timestamps: true
  });

  Cliente.associate = (models) => {
    Cliente.hasOne(models.Endereco, { as: 'endereco', foreignKey: 'id_cliente' });
    Cliente.hasMany(models.Locacao, { foreignKey: 'id_cliente' });
  }

  return Cliente;
};
