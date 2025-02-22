module.exports = (sequelize, DataTypes) => {
  const TipoVeiculo = sequelize.define("TipoVeiculo", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(30),
      allowNull: false,
    }
  }, {
    tableName: "tb_tipo_veiculo",
    timestamps: false
  });

  TipoVeiculo.associate = (models) => {
    TipoVeiculo.hasMany(models.Veiculo, { foreignKey: 'id_tipo_veiculo' });
    TipoVeiculo.hasMany(models.Marca, { as: 'tipo', foreignKey: 'id_tipo_veiculo' });
  }

  return TipoVeiculo;
};
