let db = require('./DB')

class Auth {

    static verifyLogin(login, cb) {
        db.query('SELECT mdp, id as idUser FROM UTILISATEUR WHERE email = ?', [login], (err, result) => {
            if (err) {
                console.log(err);
                cb({
                    success: false,
                    errors: ['Problème db : 1.1']
                })
            } else {
                if (result.length) {
                    cb({
                        success: true,
                        data: result[0]
                    })
                } else {
                    cb({
                        success: false,
                        errors: ["Le login ne correspond à aucun compte"]
                    })
                }
            }
        })
    }

    static setToken(data) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE UTILISATEUR SET token = ? WHERE id = ?', [data.token, data.idUser], (err, rslt) => {
                if (err) {
                    reject({
                        success: false,
                        errors: ['Problème db : 1.2']
                    })
                } else {
                    resolve({
                        success: true
                    })
                }
            })
        })
    }

    static removeToken(data) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE UTILISATEUR SET token = NULL WHERE id = ?', data.idUser, (err, rslt) => {
                if (err) {
                    reject({
                        success: false,
                        errors: ['Problème db : 1.3']
                    })
                } else {
                    resolve({
                        success: true
                    })
                }
            })
        })
    }

    static getTokenUser(data) {
        return new Promise((resolve, reject) => {
            db.query('SELECT id, token FROM UTILISATEUR WHERE email = ?', data.email, (err, rslt) => {
                if (err) {
                    reject({
                        success: false,
                        errors: ['Problème db : 1.4']
                    })
                } else {
                    resolve({
                        success: true,
                        data: rslt
                    })
                }
            })
        })
    }
}

module.exports = Auth