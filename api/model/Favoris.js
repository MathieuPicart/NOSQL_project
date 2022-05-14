let db = require('./DB')

class Favoris {
    static add (data, cb){
        db.query('INSERT INTO `FAVORIS` (`idEbook`, `idUser`) VALUES (?, ?);', Object.values(data), (err, result) => {
            if(err) {
                cb({
                    success:false,
                    errors: ['Problème db : 3.1']
                })
            }else{
                cb({
                    success: true
                })             
            }
        })
    }

    static delete (data, cb){
        db.query('DELETE FROM `FAVORIS` WHERE `FAVORIS`.`idEbook` = ? AND `FAVORIS`.`idUser` = ?;', Object.values(data), (err, result) => {
            if(err) {
                console.log(err);
                cb({
                    success:false,
                    errors: ['Problème db : 3.2']
                })
            }else{
                cb({
                    success: true
                })
            }
        })
    }

    static gets (idUser, cb){
        let data = {}
        db.query('SELECT `EBOOK`.`id`, `title`, `author`, `date`, `img`, `key_words` FROM `FAVORIS` LEFT JOIN `EBOOK` ON `FAVORIS`.`idEbook` = `EBOOK`.`id` WHERE `FAVORIS`.`idUser` = ?', idUser, (err, rslt)=>{
            if(err) {
                cb({
                    success:false,
                    errors: ['Problème db : 3.3.1']
                })
            }else{
                if(rslt.length){
                    rslt.forEach(ebook => {
                        data[ebook.id] = ebook
                        data[ebook.id].key_words = data[ebook.id].key_words.split(' ')
                        data[ebook.id].types = []
                    });

                    db.query('SELECT idEbook, TYPE.id, TYPE.name FROM EBOOK_TYPE INNER JOIN TYPE ON EBOOK_TYPE.idType = TYPE.id WHERE idEbook in (SELECT idEbook FROM FAVORIS WHERE idUser = ?)', idUser, (err, rslt2)=>{
                        if(err){

                            cb({
                                success : false,
                                errors : ['Problème db : 3.3.2']
                            })
                        }else{
                            if (rslt2.length) {
                                rslt2.forEach(type=>{
                                    if(data[type.idEbook]){
                                        data[type.idEbook].types.push({id : type.id, name : type.name})
                                    }
                                    if(rslt2[rslt2.length-1]===type){
                                        cb({
                                            success : true,
                                            data : Object.values(data)
                                        })
                                    }
                                })
                            } else {
                                cb({
                                    success : true,
                                    data : Object.values(data)
                                })
                            }
                        }
                    })
                }else{
                    cb({
                        success: false,
                        errors: ["Aucun ebook trouvés"]
                    })
                }
            }
        })
    }
}

module.exports = Favoris  