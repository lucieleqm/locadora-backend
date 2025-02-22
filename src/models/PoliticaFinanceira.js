module.exports = (sequelize, DataTypes) => {
    const PoliticaFinanceira = sequelize.define("PoliticaFinanceira", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      descricao: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      multa: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        //default: 0
      },
      juros: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        //default: 1
      },
      isAtiva: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      }, {
      tableName: "tb_politica_financeira",
      timestamps: false
    });
  
    return PoliticaFinanceira;
  };
  