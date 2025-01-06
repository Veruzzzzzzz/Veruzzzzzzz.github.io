const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    host: 'dpg-cttk7otds78s73cok1qg-a',
    dialect: 'postgres',
    username: 'veruzdatabaseloja_user',  // Mudado de 'user' para 'username'
    port: 5432,
    password: 'Aui9mfKPsMjkYDE5jhN1RKsA87lHxu4b',
    database: 'veruzdatabaseloja'
});

module.exports = sequelize;
