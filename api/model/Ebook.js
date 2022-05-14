let db = require('./DB')

class Ebook {
    static gets (cb){
        let data = {}
        db.query('SELECT EBOOK.id, summary, title, author, EBOOK.date, img, key_words, AVG(note) as avgStars FROM EBOOK LEFT JOIN COMMENT ON EBOOK.id = COMMENT.idEbook GROUP BY EBOOK.id ORDER BY avgStars DESC', (err, rslt)=>{
            if(err) {
                cb({
                    success:false,
                    errors: ['Problème db : 2.1.1']
                })
            }else{
                if(rslt.length){
                    let idOrder = []
                    rslt.forEach(ebook => {
                        idOrder.push(ebook.id)
                        data[ebook.id] = ebook
                        data[ebook.id].key_words = data[ebook.id].key_words.split(' ')
                        data[ebook.id].types = []
                    });

                    db.query('SELECT idEbook, TYPE.id, TYPE.name FROM EBOOK_TYPE INNER JOIN TYPE ON EBOOK_TYPE.idType = TYPE.id',(err, rslt2)=>{
                        if(err){

                            cb({
                                success : false,
                                errors : ['Problème db : 2.1.3']
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
                                            data : idOrder.map(id=>data[id])
                                        })
                                    }
                                })
                            } else {
                                cb({
                                    success : true,
                                    data : idOrder.map(id=>data[id])
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

    static remove(idEbook, cb){
        db.query('DELETE FROM EBOOK WHERE id = ?', idEbook, (err, rslt)=>{
            if(err){
                cb({sucess:false,errors:['Problème db : 2.7']})
            }else{
                cb({success: true})
            }
        })
    }

    static getData (idEbook, cb){
        let data = {}
        db.query('SELECT id, title, author, date, img, key_words, summary FROM EBOOK WHERE id = ?', [idEbook], (err, rslt)=>{
            if(err) {
                cb({
                    success:false,
                    errors: ['Problème db : 2.6.1']
                })
            }else{
                if(rslt.length){
                    data=rslt[0]
                    data.types = []
                    data.key_words = data.key_words.split(' ')
                    data.press_comments = []
                    data.user_comments = []

                    let types_finish = false;
                    let user_comments_finish = false;
                    let press_comments_finish = false
                    let errors = []

                    db.query('SELECT TYPE.id, TYPE.name FROM EBOOK_TYPE INNER JOIN TYPE ON EBOOK_TYPE.idType = TYPE.id WHERE EBOOK_TYPE.idEbook = ?', [idEbook], (err, rslt2)=>{
                        if(err){
                            errors.push('Problème db : 2.6.3')
                            if(user_comments_finish && press_comments_finish){
                                cb({
                                    success:false,
                                    errors: errors
                                })
                            }else{
                                types_finish = true
                            }
                        }else{
                            if(rslt2.length){
                                rslt2.forEach(type=>{
                                    data.types.push(type)
                                    
                                    if(rslt2[rslt2.length-1]===type){
                                        if(user_comments_finish && press_comments_finish){
                                            if(errors.length){
                                                cb({
                                                    success:false,
                                                    errors: errors
                                                })
                                            }else{
                                                cb({
                                                    success : true,
                                                    data : data
                                                })
                                            }
                                        }else{
                                            types_finish = true;
                                        }
                                    }
                                })
                            }else{
                                if(user_comments_finish && press_comments_finish){
                                    if(errors.length){
                                        cb({
                                            success:false,
                                            errors: errors
                                        })
                                    }else{
                                        cb({
                                            success : true,
                                            data : data
                                        })
                                    }
                                }else{
                                    types_finish = true;
                                }
                            }
                        }
                    })

                    db.query('SELECT PRESS_COMMENT.id, PRESS_COMMENT.idPress, PRESS_COMMENT.text, PRESS_COMMENT.date, PRESS_COMMENT.note, PRESS.name, PRESS.link FROM PRESS_COMMENT INNER JOIN PRESS ON PRESS_COMMENT.idPress = PRESS.id WHERE PRESS_COMMENT.idEbook = ?', [idEbook], (err, rslt3)=>{
                        if(err){
                            errors.push('Problème db : 2.6.4')
                            if(user_comments_finish && types_finish){
                                cb({
                                    success:false,
                                    errors: errors
                                })
                            }else{
                                press_comments_finish = true
                            }
                        }else{
                            if(rslt3.length){
                                rslt3.forEach(pComment=>{
                                    data.press_comments.push(pComment)
                                    
                                    if(rslt3[rslt3.length-1]===pComment){
                                        if(user_comments_finish && types_finish){
                                            if(errors.length){
                                                cb({
                                                    success:false,
                                                    errors: errors
                                                })
                                            }else{
                                                cb({
                                                    success : true,
                                                    data : data
                                                })
                                            }
                                        }else{
                                            press_comments_finish = true;
                                        }
                                    }
                                })
                            }else{
                                if(user_comments_finish && types_finish){
                                    if(errors.length){
                                        cb({
                                            success:false,
                                            errors: errors
                                        })
                                    }else{
                                        cb({
                                            success : true,
                                            data : data
                                        })
                                    }
                                }else{
                                    press_comments_finish = true;
                                }
                            }
                        }
                    })


                    db.query('SELECT COMMENT.id, COMMENT.idUser, COMMENT.text, COMMENT.date, COMMENT.note, USER.firstname, USER.name, USER.img FROM COMMENT INNER JOIN USER ON COMMENT.idUser = USER.id WHERE COMMENT.idEbook = ?', [idEbook], (err, rslt4)=>{
                        if(err){
                            errors.push('Problème db : 2.6.5')
                            if(press_comments_finish && types_finish){
                                cb({
                                    success:false,
                                    errors: errors
                                })
                            }else{
                                user_comments_finish = true
                            }
                        }else{
                            if(rslt4.length){
                                rslt4.forEach(uComment=>{
                                    data.user_comments.push(uComment)
                                    
                                    if(rslt4[rslt4.length-1]===uComment){
                                        if(press_comments_finish && types_finish){
                                            if(errors.length){
                                                cb({
                                                    success:false,
                                                    errors: errors
                                                })
                                            }else{
                                                cb({
                                                    success : true,
                                                    data : data
                                                })
                                            }
                                        }else{
                                            user_comments_finish = true;
                                        }
                                    }
                                })
                            }else{
                                if(press_comments_finish && types_finish){
                                    if(errors.length){
                                        cb({
                                            success:false,
                                            errors: errors
                                        })
                                    }else{
                                        cb({
                                            success : true,
                                            data : data
                                        })
                                    }
                                }else{
                                    user_comments_finish = true;
                                }
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

    static add(data, cb){

        db.query('INSERT INTO EBOOK (title, author, date, img, key_words, summary) VALUES (?, ?, ?, ?, ?, ?)', [data.title, data.author, data.date, data.img, data.key_words.join(' '), data.summary], (err, rslt)=>{
            if(err){
                cb({
                    success : false,
                    errors : ['Problème db : 2.2.1']
                })
            }else{
                let insertId = rslt.insertId
                let errors = [];

                let insert_types_isFinish = false;
                let insert_press_isFinish = false;
                
                if(data.idTypes.length){
                    db.query('INSERT INTO EBOOK_TYPE (idType, idEbook) VALUES ?', [data.idTypes.map(types=>[types, insertId])], (err2, rslt2)=>{
                        if(err2){
                            errors.push('Problème db : 2.2.3')
                            if(insert_press_isFinish){
                                db.query('DELETE FROM EBOOK WHERE id = ?', insertId, (errD, rsltD)=>{})
                                cb({
                                    success : false,
                                    errors : errors
                                })
                            }else{
                                insert_types_isFinish = true;
                            }
                        }else{
                            if(insert_press_isFinish){
                                if(!errors.length){
                                    cb({
                                        success : true,
                                        id :insertId
                                    })
                                }else{
                                    db.query('DELETE FROM EBOOK WHERE id = ?', insertId, (errD, rsltD)=>{})
                                    cb({
                                        success : false,
                                        errors : errors
                                    })
                                }                           
                            }else{
                                insert_types_isFinish = true;
                            }
                        }
                    })
                }else{
                    if(insert_press_isFinish){
                        if(!errors.length){
                            cb({
                                success : true,
                                id :insertId
                            })
                        }else{
                            db.query('DELETE FROM EBOOK WHERE id = ?', insertId, (errD, rsltD)=>{})
                            cb({
                                success : false,
                                errors : errors
                            })
                        }                           
                    }else{
                        insert_types_isFinish = true;
                    }
                }

                if(data.press_comments.length){
                    db.query('INSERT INTO PRESS_COMMENT (idPress, text, date, note, idEbook) VALUES ?', 
                    [data.press_comments.map((comment)=>[comment.idPress, comment.text, comment.date, comment.note, insertId])], (err3, rslt3)=>{
                        if(err3){
                            errors.push('Problème db : 2.2.4')
                            if(insert_types_isFinish){
                                db.query('DELETE FROM EBOOK WHERE id = ?', insertId, (errD, rsltD)=>{})
                                cb({
                                    success : false,
                                    errors : errors
                                })
                            }else{
                                insert_press_isFinish = true;
                            }
                        }else{
                            if(insert_types_isFinish){
                                if(!errors.length){
                                    cb({
                                        success : true,
                                        id :insertId
                                    })
                                }else{
                                    db.query('DELETE FROM EBOOK WHERE id = ?', insertId, (errD, rsltD)=>{})
                                    cb({
                                        success : false,
                                        errors : errors
                                    })
                                }                           
                            }else{
                                insert_press_isFinish = true;
                            }
                        }
                    })
                }else{
                    if(insert_types_isFinish){
                        if(!errors.length){
                            cb({
                                success : true,
                                id :insertId
                            })
                        }else{
                            db.query('DELETE FROM EBOOK WHERE id = ?', insertId, (errD, rsltD)=>{})
                            cb({
                                success : false,
                                errors : errors
                            })
                        }                           
                    }else{
                        insert_press_isFinish = true;
                    }
                }
            }
        })

    }

    static updt(data, cb){

        db.query('UPDATE EBOOK SET title = ? , author = ? , date = ? , img = ?, key_words = ?, summary = ? WHERE id = ? ', [data.title, data.author, data.date, data.img, data.key_words.join(' '), data.summary, data.idEbook], (err, rslt)=>{
            if(err){
                cb({
                    success : false,
                    errors : ['Problème db : 2.5.1']
                })
            }else{
                let errors = [];

                let insert_types_isFinish = false;
                let insert_press_isFinish = false;

                db.query('DELETE FROM EBOOK_TYPE WHERE idEbook = ?', [data.idEbook], (err5, rslt5)=>{
                    if(err5){
                        errors.push('Problème db : 2.5.3.1')
                        if(insert_press_isFinish){
                            cb({
                                success : false,
                                errors : errors
                            })
                        }else{
                            insert_types_isFinish = true;
                        }
                    }else{
                        if(data.idTypes.length){
                            db.query('INSERT INTO EBOOK_TYPE (idType, idEbook) VALUES ?', [data.idTypes.map(types=>[types, data.idEbook])], (err2, rslt2)=>{
                                if(err2){
                                    errors.push('Problème db : 2.5.3.2')
                                    if(insert_press_isFinish){
                                        cb({
                                            success : false,
                                            errors : errors
                                        })
                                    }else{
                                        insert_types_isFinish = true;
                                    }
                                }else{
                                    if(insert_press_isFinish){
                                        if(!errors.length){
                                            cb({
                                                success : true
                                            })
                                        }else{
                                            cb({
                                                success : false,
                                                errors : errors
                                            })
                                        }                           
                                    }else{
                                        insert_types_isFinish = true;
                                    }
                                }
                            })
                        }else{
                            if(insert_press_isFinish){
                                if(!errors.length){
                                    cb({
                                        success : true
                                    })
                                }else{
                                    cb({
                                        success : false,
                                        errors : errors
                                    })
                                }                           
                            }else{
                                insert_types_isFinish = true;
                            }
                        }
                    }
                })
                
                db.query('DELETE FROM PRESS_COMMENT WHERE idEbook = ?', [data.idEbook], (err6, rslt6)=>{
                    if(err6){
                        errors.push('Problème db : 2.5.4.1')
                        if(insert_types_isFinish){
                            cb({
                                success : false,
                                errors : errors
                            })
                        }else{
                            insert_press_isFinish = true;
                        }
                    }else{
                        if(data.press_comments.length){
                            db.query('INSERT INTO PRESS_COMMENT (idPress, text, date, note, idEbook) VALUES ?', 
                            [data.press_comments.map((comment)=>[comment.idPress, comment.text, comment.date, comment.note, data.idEbook])], (err3, rslt3)=>{
                                if(err3){
                                    errors.push('Problème db : 2.5.4.2')
                                    if(insert_types_isFinish){
                                        cb({
                                            success : false,
                                            errors : errors
                                        })
                                    }else{
                                        insert_press_isFinish = true;
                                    }
                                }else{
                                    if(insert_types_isFinish){
                                        if(!errors.length){
                                            cb({
                                                success : true
                                            })
                                        }else{
                                            cb({
                                                success : false,
                                                errors : errors
                                            })
                                        }                           
                                    }else{
                                        insert_press_isFinish = true;
                                    }
                                }
                            })
                        }else{
                            if(insert_types_isFinish){
                                if(!errors.length){
                                    cb({
                                        success : true
                                    })
                                }else{
                                    cb({
                                        success : false,
                                        errors : errors
                                    })
                                }                           
                            }else{
                                insert_press_isFinish = true;
                            }
                        }
                    }
                })
                
            }
        })

    }

    static setPage (data, cb){
        db.query('SELECT 1 FROM `PAGE` WHERE `idUser` = ? AND `idEbook` = ?', [data.idUser, data.idEbook], (err, rslt)=>{
            if(err) {
                cb({
                    success: false,
                    errors: ['Problème db : 2.3.1']
                })
            }else{
                if(rslt.length){
                    db.query('UPDATE `PAGE` SET `page`= ? WHERE `idUser` = ? AND `idEbook`= ?', [data.page, data.idUser, data.idEbook], (err, rslt) => {
                        if(err) {
                            cb({
                                success: false,
                                errors: ['Problème db : 2.3.2']
                            })
                        }else{
                            cb({
                                success: true
                            })
                        }
                    })
                }else{
                    db.query('INSERT INTO `PAGE` (`idUser`, `idEbook`, `page`) VALUES (?,?,?);', [data.idUser, data.idEbook, data.page], (err, rslt) => {
                        if(err) {
                            cb({
                                success: false,
                                errors: ['Problème db : 2.3.3']
                            })
                        }else{
                            cb({
                                success: true
                            })
                        }
                    })
                }
            }
        })
    }

    static getCurrentPage (data, cb){
        db.query('SELECT page FROM `PAGE` WHERE `idUser` = ? AND `idEbook` = ?', [data.idUser, data.idEbook], (err, rslt)=>{
            if(err) {
                cb({
                    success: false,
                    errors: ['Problème db : 2.4.1']
                })
            }else{
                if(rslt.length){
                    cb({
                        success: true,
                        data: rslt
                    })
                }else{
                    cb({
                        success: false,
                        errors: ['Problème db : 2.4.2']
                    })
                }
            }
        })
    }
}

module.exports = Ebook  