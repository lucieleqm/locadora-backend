module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    estrelas: {
      type: DataTypes.FLOAT,
      allowNull: false,
      default: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    comentario: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    id_locacao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tb_locacao',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
    }, {
    tableName: "tb_review",
    timestamps: true
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Locacao, { foreignKey: 'id_locacao' });
  }

  return Review;
}