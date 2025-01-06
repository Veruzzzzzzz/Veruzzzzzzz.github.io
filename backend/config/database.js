const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    host: 'localhost',
    dialect: 'postgres',
    user: 'veruzbancodedados_user',
    port: 5432,
    password: 'sXXUxmXNvJQszKYreukIUlInIX5pk8WZ',
    database: 'veruzbancodedados'
});

module.exports = sequelize;
