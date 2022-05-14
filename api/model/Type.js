let db = require('./DB')

class Type {
    static add (name, cb){
        db.query('INSERT INTO `TYPE` (`name`) VALUES ( ? );', name, (err, result)=>{
            if(err) {
                cb({
                    success:false,
                    errors: ['Problème db : 4.1']
                })
            }else{
                cb({
                    success: true
                })             
            }
        })
    }

    static delete (idType, cb){
        db.query('DELETE FROM `TYPE` WHERE `TYPE`.`id` = ?', idType, (err, result)=>{
            if(err) {
                console.log(err);
                cb({
                    success: false,
                    errors: ['Problème db : 4.2']
                })
            }else{
                cb({
                    success: true
                })
            }
        })
    }

    static gets (cb){
        db.query('SELECT id, name FROM TYPE WHERE 1', (err, result) => {
            if(err) {
                cb({
                    success:false,
                    errors: ['Problème db : 4.3']
                })
            }else{
                if(result.length){
                    cb({
                        success: true,
                        data: result
                    })
                }else{
                    cb({
                        success: false,
                        errors: ["Impossible de récupérer les type"]
                    })
                }
            }
        })
    }

    static updt (data, cb){
        db.query('UPDATE `TYPE` SET `name` = ? WHERE `TYPE`.`id` = ?;', Object.values(data), (err, result) => {
            if(err) {
                cb({
                    success:false,
                    errors: ['Problème db : 3.3']
                })
            }else{
                cb({
                    success: true
                })
            }
        })
    }
}

module.exports = Type  