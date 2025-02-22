module.exports = (sequelize, DataTypes) => {
  const Blacklist = sequelize.define("Blacklist", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: "tb_blacklist",
    timestamps: true
  });

  return Blacklist;
};
