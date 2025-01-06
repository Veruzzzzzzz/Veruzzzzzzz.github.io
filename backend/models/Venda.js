const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const Funcionario = require('./Funcionario');
const Produto = require('./Produto');

const Venda = sequelize.define('Venda', {
    id_venda: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_funcionario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_produto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

// Definindo os relacionamentos
Venda.belongsTo(Cliente, { foreignKey: 'id_cliente' });
Venda.belongsTo(Funcionario, { foreignKey: 'id_funcionario' });
Venda.belongsTo(Produto, { foreignKey: 'id_produto' });

module.exports = Venda; 