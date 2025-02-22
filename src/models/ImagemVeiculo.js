module.exports = (sequelize, DataTypes) => {
  const ImagemVeiculo = sequelize.define("ImagemVeiculo", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    id_veiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tb_veiculo',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  }, {
      tableName: "tb_img_veiculo",
      timestamps: false
  });

  ImagemVeiculo.associate = (models) => {
    ImagemVeiculo.belongsTo(models.Veiculo, { foreignKey: 'id_veiculo' });
  };

  return ImagemVeiculo;
};
