module.exports = (sequelize, DataTypes) => {
    const Endereco = sequelize.define("Endereco", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rua: {
            type: DataTypes.STRING,
            allowNull: true
        },
        numero: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bairro: {
            type: DataTypes.STRING,
            allowNull: true
        },
        complemento: {
            type: DataTypes.STRING,
        },
        cidade: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cep: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_cliente: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tb_cliente',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }

    }, {
        tableName: "tb_endereco",
        timestamps: false
    });

    Endereco.associate = (models) => {
        Endereco.belongsTo(models.Cliente, { as: 'cliente', foreignKey: 'id_cliente'});
    }

    return Endereco;
}