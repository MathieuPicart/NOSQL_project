let db = require('./DB')

class Comment {
    static add (data, cb){
        let date = Date.now()
        db.query('INSERT INTO `COMMENT` (`idEbook`, `text`, `date`, `note`, `idUser`) VALUES (?, ?, ?, ?, ?);', [data.idEbook, data.text, date, data.note, data.idUser], (err, result)=>{
            if(err) {
                console.log(err);
                cb({
                    success:false,
                    errors: ['Problème db : 6.1']
                })
            }else{
                cb({
                    success: true
                })
            }
        })
    }

    static delete (idComment, cb){
        db.query('DELETE FROM `COMMENT` WHERE `COMMENT`.`id` = ?', idComment, (err, result)=>{
            if(err) {
                cb({
                    success:false,
                    errors: ['Problème db : 6.2']
                })
            }else{
                cb({
                    success: true
                })
            }
        })
    }

    static updt (data, cb){
        let date = Date.now()
        db.query('UPDATE `COMMENT` SET `text` = ?, `date` = ?, `note` = ? WHERE `COMMENT`.`id` = ? ', [data.text, date, data.note, data.idComment], (err, result)=>{
            if(err) {
                cb({
                    success:false,
                    errors: ['Problème db : 6.3']
                })
            }else{
                cb({
                    success: true
                })
            }
        })
    }
}

module.exports = Comment  