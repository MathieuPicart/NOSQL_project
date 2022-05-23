const mysql = require('mysql');

const pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

// pool.connect((err) => {
// 	if (err) throw err
// 	console.log("Connect to DB");
// })

// pool.query("SELECT *  FROM utilisateur", (err, results) => {console.log(results);})

module.exports = pool;
