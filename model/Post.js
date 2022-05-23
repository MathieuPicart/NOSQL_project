var db = require('./DB')

class User {

    static create = (data) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO POST`)
        })
    }
}