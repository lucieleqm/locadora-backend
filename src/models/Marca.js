module.exports = (sequelize, DataTypes) => {
  const Marca = sequelize.define("Marca", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_tipo_veiculo: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tb_tipo_veiculo',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',

      allowNull: false
    }
    }, {
    tableName: "tb_marca",
    timestamps: false
  });

  Marca.associate = (models) => {
    Marca.hasMany(models.Modelo, {as: 'marca', foreignKey: 'id_marca'});
    Marca.belongsTo(models.TipoVeiculo, { as: 'tipo', foreignKey: 'id_tipo_veiculo'});
  }

  return Marca;
};
