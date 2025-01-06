const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    host: 'dpg-cttk7otds78s73cok1qg-a',
    dialect: 'postgres',
    username: 'veruzbancodedados_user',  // Mudado de 'user' para 'username'
    port: 5432,
    password: 'sXXUxmXNvJQszKYreukIUlInIX5pk8WZ',
    database: 'veruzbancodedados',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

module.exports = sequelize;
