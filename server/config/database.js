const { Sequelize } = require('sequelize');

// Configure database connection
const sequelize = new Sequelize('unihub', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

// Test the connection
sequelize
    .authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch((error) => console.error('Unable to connect to the database:', error));

module.exports = sequelize;
