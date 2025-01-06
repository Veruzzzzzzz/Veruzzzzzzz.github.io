const Sequelize = require('sequelize');

const sequelize = new Sequelize('loja', 'root', 'root', {
    host: 'dpg-cttk7otds78s73cok1qg-a',
    dialect: 'postgres',
    user :veruzdatabaseloja_user,
    port: 5432,
    password: Aui9mfKPsMjkYDE5jhN1RKsA87lHxu4b,
    database: veruzdatabaseloja
});

module.exports = sequelize; 
