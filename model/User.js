var db = require('./DB')

class User {

    static get = (cb) => {
        db.query('SELECT * FROM `UTILISATEUR` WHERE 1',
            (err, result) => {
                if (err) {
                    cb({
                        success: false,
                        errors: ['Problème db : 2.1']
                    })
                } else {
                    if (result.length) {
                        cb({
                            success: true,
                            data: result
                        })
                    } else {
                        cb({
                            success: false,
                            errors: ["Impossible de récupérer les opérateurs"]
                        })
                    }
                }
            })
    }

    static add = (data) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO UTILISATEUR 
                (nom, prenom, email, mdp, telephone, adresse, bio) 
                VALUES (?,?,?,?,?,?,?)`,
                [data.nom, data.prenom, data.email, data.mdp, data.telephone, data.adresse, data.bio],
                (err, result) => {
                    if (err) {
                        reject({
                            success: false,
                            errors: ['Problème db : 2.2']
                        })
                    } else {
                        resolve({
                            success: true,
                            data: {
                                _id : result.insertId
                            }
                        })
                    }
                })
        })

    }

    static update = async (idUser, data) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE UTILISATEUR SET UTILISATEUR.mdp = ? WHERE UTILISATEUR.id = ?`,
            [data.mdp, idUser],
            (err, result) => {
                if (err) {
                    reject({ success: false, errors: ['Problème db : 2.4'] })
                } else {
                    resolve({ success: true, data: result })
                }
            })
        })      
    }

    static findOne = async (data) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT id as idUser, email, mdp, token, nom, prenom, bio, adresse FROM utilisateur WHERE utilisateur.email = ?",
                data.email,
                (err, result) => {
                    if (err) {
                        reject({
                            success: false,
                            error: err
                        })
                    } else {
                        if (result.length)
                            resolve({
                                success: true,
                                data: result[0]
                            })
                        else
                            resolve({
                                success: false,
                                errors: "Email introuvable"
                            })
                    }
                })
        })
    }

    static findById = async (data) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT id as idUser, email, token, prenom FROM utilisateur WHERE utilisateur.id = ?",
                data.idUser,
                (err, result) => {
                    if (err) {
                        reject({
                            success: false,
                            error: err
                        })
                    } else {
                        if (result.length)
                            resolve({
                                success: true,
                                data: result[0]
                            })
                        else
                            resolve({
                                success: false,
                                errors: "Utilisateur introuvable"
                            })
                    }
                }
            )
        })
    }




}

module.exports = User