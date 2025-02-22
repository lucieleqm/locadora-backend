module.exports = (sequelize, DataTypes) => {
    const ImagemLocacao = sequelize.define("ImagemLocacao", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      url: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      id_locacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_locacao',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    }, {
        tableName: "tb_img_locacao",
        timestamps: false
    });
  
    ImagemLocacao.associate = (models) => {
      ImagemLocacao.belongsTo(models.Locacao, { foreignKey: 'id_locacao' });
    };
  
    return ImagemLocacao;
  };
  