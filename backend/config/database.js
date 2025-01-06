const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    host: 'dpg-cttk7otds78s73cok1qg-a',
    dialect: 'postgres',
    user: 'veruzbancodedados_user',
    port: 5432,
    password: 'sXXUxmXNvJQszKYreukIUlInIX5pk8WZ',
    database: 'veruzbancodedados'
});

module.exports = sequelize;
