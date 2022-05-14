let mysql      = require('mysql')

let connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : 'mathieupicart_ubooks'
})

connection.connect()

module.exports = connection