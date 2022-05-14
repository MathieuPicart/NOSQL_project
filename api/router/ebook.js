let express = require('express')
let router = express.Router();

let respond = require('../ResponseSender')

let Ebook = require('../model/Ebook')

let tokens = require('../tokens')

let fs = require('fs')

let pipeline = require('stream').pipeline

router.post('/gets', (req, res)=>{

    let body = req.body

    if(tokens[body.token]){
        Ebook.gets((rslt) => {
            if (rslt.success) {
                respond({ success: true, 
                          data: rslt.data
                }, "/api/ebook/gets", req.idLog, res)
            }else{
                respond(rslt, "/api/ebook/gets", req.idLog, res)
            }
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/ebook/gets', req.idLog, res, 403)
    }
})

router.post('/delete', (req, res)=>{
    let body = req.body

    if(tokens[body.token] && tokens[body.token].roleUser === 3){
        Ebook.remove(body.data.idEbook, (rslt)=>{
            respond(rslt, '/api/ebook/delete', req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/ebook/delete', req.idLog, res, 403)
    }
})

router.post('/getData', (req, res)=>{

    let body = req.body

    if(tokens[body.token]){
        Ebook.getData(body.data.idEbook, (rslt) => {
            if (rslt.success) {
                respond({ success: true, 
                          data: rslt.data
                }, "/api/ebook/getData", req.idLog, res)
            }else{
                respond(rslt, "/api/ebook/getData", req.idLog, res)
            }
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/ebook/getData', req.idLog, res, 403)
    }
})

router.post('/add', (req, res)=>{
    let body = req.body;

    body.data.idKey_words = body.data.key_words.filter((value, index, self)=>{
        return self.indexOf(value) === index;
    })

    body.data.idTypes = body.data.idTypes.filter((value, index, self)=>{
        return self.indexOf(value) === index;
    })

    if(tokens[body.token] && tokens[body.token].roleUser===3){
        Ebook.add(body.data, (rslt)=>{
            if(rslt.success){
                let fileName = rslt.id + '.pdf';
                if(fs.existsSync(`${__dirname}/../staticFiles/epubs/${fileName}`)){
                    Ebook.remove(rslt.id, (rslt)=>{
                        respond({success: false, errors: ['Id de fichier déja utilisé']}, '/api/ebook/add', req.idLog, res, 500)
                    })
                }else{
                    pipeline(req.file.stream, fs.createWriteStream(`${__dirname}/../staticFiles/epubs/${fileName}`), (err)=>{
                        if(err){
                            Ebook.remove(rslt.id, (rslt)=>{
                                respond({success: false, errors: [`L'enregistrement du fichier n'a pas pu ce faire`]}, '/api/ebook/add', req.idLog, res)
                            })
                        }else{
                            respond({success: true}, '/api/ebook/add', req.idLog, res)
                        }
                    })
                }
            }else{
                respond(rslt, '/api/ebook/add', req.idLog, res)
            }
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/ebook/add', req.idLog, res, 403)
    }
})

router.post('/updt', (req, res)=>{
    let body = req.body;

    body.data.idKey_words = body.data.key_words.filter((value, index, self)=>{
        return self.indexOf(value) === index;
    })

    body.data.idTypes = body.data.idTypes.filter((value, index, self)=>{
        return self.indexOf(value) === index;
    })

    if(tokens[body.token] && tokens[body.token].roleUser===3){
        Ebook.updt(body.data, (rslt)=>{
            if (rslt.success) {
                respond({ success: true }, "/api/ebook/updt", req.idLog, res)
            }else{
                respond(rslt, "/api/ebook/updt", req.idLog, res)
            }
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/ebook/updt', req.idLog, res, 403)
    }
})

router.post('/setPage', (req, res) => {
    let body = req.body;

    if(tokens[body.token]){
        body.data.idUser = tokens[body.token].idUser
        Ebook.setPage(body.data, (rslt)=>{
            respond(rslt, "/api/ebook/Page", req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/ebook/add', req.idLog, res, 403)
    }
})

router.post('/getCurrentPage', (req, res) => {
    let body = req.body;

    if(tokens[body.token]){
        body.data.idUser = tokens[body.token].idUser
        Ebook.getCurrentPage(body.data, (rslt)=>{
            if (rslt.success) {
                respond({
                    success : true,
                    data: rslt.data
                }, "/api/ebook/getCurrentPage", req.idLog, res)
            }else{
                respond(rslt, "/api/ebook/getCurrentPage", req.idLog, res)
            }
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/ebook/getCurrentPage', req.idLog, res, 403)
    }
})

module.exports = router;