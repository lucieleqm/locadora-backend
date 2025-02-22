module.exports = (sequelize, DataTypes) => {
  const Locacao = sequelize.define("Locacao", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.ENUM("pendente", "ativa", "inativa", "renovada"),
      defaultValue: "ativa"
    },
    pode_renovar: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    dt_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dt_final: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    caucao: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    valor_locacao: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    km: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    id_veiculo: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tb_veiculo',
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tb_cliente',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
    }, {
    tableName: "tb_locacao",
    timestamps: true
  });

  Locacao.associate = (models) => {
    Locacao.belongsTo(models.Veiculo, { foreignKey: 'id_veiculo' });
    Locacao.belongsTo(models.Cliente, { foreignKey: 'id_cliente' });
    Locacao.hasMany(models.Pagamento, { as: 'pagamento', foreignKey: 'id_locacao' });
    Locacao.hasOne(models.Review, { foreignKey: 'id_locacao' });
    Locacao.hasMany(models.ImagemLocacao, { foreignKey: 'id_locacao' });
  }

  return Locacao;
};
