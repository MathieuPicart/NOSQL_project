let db = require('./DB')

class Connection {

    static verifyLogin (email, cb){

        db.query('SELECT pass, id as idUser, role, img FROM USER WHERE email = ?', [email], (err, result)=>{
            if(err) {
                cb({
                    success:false,
                    errors: ['Problème db : 1.1']
                })
            }else{
                if(result.length){
                    cb({
                        success : true,
                        data : result[0]
                    })
                }else{
                    cb({
                        success: false,
                        errors: ["L'email ne correspond à aucun compte"]
                    })
                }
            }
        })
    }

    static setToken(data, cb){

        db.query('UPDATE USER SET token = ? WHERE id = ?', data, (err, rslt)=>{
            if(err){
                cb({
                    success:false,
                    errors: ['Problème db : 1.2']
                })
            }else{
                cb({success: true})
            }
        })
    }

    static removeToken(idUser, cb){

        db.query('UPDATE USER SET token = NULL WHERE id = ?', idUser, (err, rslt)=>{
            if(err){
                cb({
                    success:false,
                    errors: ['Problème db : 1.3']
                })
            }else{
                cb({
                    success:true
                })
            }
        })

    }

    static getTokenUser(cb){

        db.query('SELECT id, role, token FROM USER', (err, rslt)=>{
            if(err){
                cb({
                    success:false,
                    errors: ['Problème db : 1.4']
                })
            }else{
                cb({success: true,
                    data: rslt})
            }
        })
    }
    
}

module.exports = Connection  