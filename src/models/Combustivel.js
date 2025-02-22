module.exports = (sequelize, DataTypes) => {
  const Combustivel = sequelize.define("Combustivel", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    }
    }, {
    tableName: "tb_combustivel",
    timestamps: false
  });

  Combustivel.associate = (models) => {
    Combustivel.hasMany(models.Veiculo, {as: 'combustivel', foreignKey: 'id_combustivel'});
  };

  return Combustivel;
};
