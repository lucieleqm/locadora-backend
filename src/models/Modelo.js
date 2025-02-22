
module.exports = (sequelize, DataTypes) => {
  const Modelo = sequelize.define("Modelo", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    id_marca: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tb_marca',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
    }, {
    tableName: "tb_modelo",
    timestamps: false
  });

  Modelo.associate = (models) => {
    Modelo.belongsTo(models.Marca, { as: 'marca', foreignKey: 'id_marca' });
    Modelo.hasMany(models.Veiculo, { as: 'modelo', foreignKey: 'id_modelo' });
  }

  return Modelo;
};
