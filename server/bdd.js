const { Pool } = require('pg');
require('dotenv').config()

// Configuration de la connexion à la base de données
const BDD = new Pool({
    user: process.env.BDD_USER,
    host: process.env.BDD_HOST,
    database: process.env.BDD_DATABASE,
    password: process.env.BDD_PASSWORD,
    port: process.env.BDD_PORT,
});

module.exports = {
    BDD
};