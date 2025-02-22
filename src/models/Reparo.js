module.exports = (sequelize, DataTypes) => {
  const Reparo = sequelize.define("Reparo", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    custo: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    id_veiculo: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tb_veiculo',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
    }, {
    tableName: "tb_reparo",
    timestamps: false
  });

  Reparo.associate = (models) => {
    Reparo.belongsTo(models.Veiculo, { foreignKey: 'id_veiculo' });
  }

  return Reparo;
};
