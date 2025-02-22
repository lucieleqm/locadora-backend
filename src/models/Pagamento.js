module.exports = (sequelize, DataTypes) => {
  const Pagamento = sequelize.define("Pagamento", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    num_parcela: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_parcelas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    valor_parcela: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    dt_vencimento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'paga', 'vencida'),
      allowNull: false,
      defaultValue: 'pendente'
    },
    dt_pagamento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    multa: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    juros: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 1
    },
    multa_aplicada: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },
    juros_acumulados: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },
    novo_valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    id_locacao: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tb_locacao',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }, {
    tableName: "tb_pagamento",
    timestamps: true
  });

  Pagamento.associate = (models) => {
    Pagamento.belongsTo(models.Locacao, { as: 'locacao', foreignKey: 'id_locacao' });
  }

  Pagamento.prototype.calcularNovoValor = function () {
    const dataAtual = new Date();
    const diasAtraso = Math.ceil((dataAtual - this.dt_vencimento) / (1000 * 60 * 60 * 24));

    const multaAplicada = Number(this.multa)
    const jurosAcumulados = this.valor_parcela * (this.juros / 100) * diasAtraso;
  
    const novoValor = Number(this.valor_parcela) + multaAplicada + jurosAcumulados;

    return { novoValor, multaAplicada, jurosAcumulados };
  };

  return Pagamento;
};
