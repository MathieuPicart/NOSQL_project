let db = require('./DB')

class Press {
    static add (data, cb){
        db.query('INSERT INTO `PRESS` (`name`,`link`) VALUES ( ?,? );', [data.name, data.link], (err, result)=>{
            if(err) {
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

    static delete (idPress, cb){
        db.query('DELETE FROM `PRESS` WHERE `PRESS`.`id` = ?', idPress, (err, result)=>{
            if(err) {
                console.log(err);
                cb({
                    success: false,
                    errors: ['Problème db : 6.2']
                })
            }else{
                cb({
                    success: true
                })
            }
        })
    }

    static gets (cb){
        db.query('SELECT id, name, link FROM PRESS WHERE 1', (err, result) => {
            if(err) {
                cb({
                    success: false,
                    errors: ['Problème db : 6.3']
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
                        errors: ["Impossible de récupérer les press"]
                    })
                }
            }
        })
    }

    static updt (data, cb){
        db.query('UPDATE `PRESS` SET `name` = ?, `link` = ? WHERE `PRESS`.`id` = ?;', [data.name, data.link, data.idPress], (err, result) => {
            if(err) {
                console.log(err);
                cb({
                    success:false,
                    errors: ['Problème db : 6.4']
                })
            }else{
                cb({
                    success: true
                })
            }
        })
    }

    static addComment (data, cb){
        db.query('INSERT INTO `PRESS_COMMENT` (`idPress`,`idEbook`,`text`,`date`,`note`) VALUES (?,?,?,?,?);', [data.idPress, data.idEbook, data.text, data.date, data.note], (err, result)=>{
            if(err) {
                cb({
                    success:false,
                    errors: ['Problème db : 6.5']
                })
            }else{
                cb({
                    success: true
                })             
            }
        })
    }

    static deleteComment (idPress_Comment, cb){
        db.query('DELETE FROM `PRESS_COMMENT` WHERE `PRESS_COMMENT`.`id` = ?', idPress_Comment, (err, result)=>{
            if(err) {
                console.log(err);
                cb({
                    success: false,
                    errors: ['Problème db : 6.6']
                })
            }else{
                cb({
                    success: true
                })
            }
        })
    }

    static updtComment (data, cb){
        db.query('UPDATE `PRESS_COMMENT` SET `text` = ?, `date` = ?, `note` = ? WHERE `PRESS_COMMENT`.`id` = ?;', [data.text, data.date, data.note, data.idPress_Comment], (err, result)=>{
            if(err) {
                console.log(err);
                cb({
                    success: false,
                    errors: ['Problème db : 6.7']
                })
            }else{
                cb({
                    success: true
                })
            }
        })
    }

    static getPress_Comment (cb){
        db.query('SELECT id, idPress, idEbook, text, date, note FROM `PRESS_COMMENT` WHERE 1', (err, result) => {
            if(err) {
                cb({
                    success: false,
                    errors: ['Problème db : 6.8']
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
                        errors: ["Impossible de récupérer les commentaires des press"]
                    })
                }
            }
        })
    }

}

module.exports = Press  