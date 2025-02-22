module.exports = (sequelize, DataTypes) => {
  const Veiculo = sequelize.define("Veiculo", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_tipo_veiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tb_tipo_veiculo',
        key: 'id'
      },

      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    placa: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    renavam: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    chassi: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    motor: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    ano: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    valor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    km: {
      type: DataTypes.FLOAT,
      allowNull: true,
      default: 0
    },
    isLocado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      default: false
    },
    id_modelo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tb_modelo',
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    id_combustivel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tb_combustivel',
        key: 'id'
      },

      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    id_cor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tb_cor',
        key: 'id'
      },

      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    }, {
    tableName: "tb_veiculo",
    timestamps: true
  });

  Veiculo.associate = (models) => {
    Veiculo.belongsTo(models.Modelo, { as: 'modelo', foreignKey: 'id_modelo' });
    Veiculo.belongsTo(models.Combustivel, { as: 'combustivel', foreignKey: 'id_combustivel' });
    Veiculo.belongsTo(models.Cor, { as: 'cor', foreignKey: 'id_cor' });
    Veiculo.belongsTo(models.TipoVeiculo, { foreignKey: 'id_tipo_veiculo' });
    Veiculo.hasMany(models.Reparo, { foreignKey: 'id_veiculo' });
    Veiculo.hasMany(models.Locacao, { foreignKey: 'id_veiculo' });
    Veiculo.hasMany(models.ImagemVeiculo, { foreignKey: 'id_veiculo' });
  };

  return Veiculo;
};
