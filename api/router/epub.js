let express = require('express')
let router = express.Router();

let respond = require('../ResponseSender')

let fs = require('fs')

let tokens = require('../tokens')

router.post('/get', (req, res)=>{
    let body = req.body
    if(tokens[body.token]){
        if(fs.existsSync(`${__dirname}/../staticFiles/epubs/`+body.data.idEbook+`.pdf`)){
            var file = fs.createReadStream(`${__dirname}/../staticFiles/epubs/`+body.data.idEbook+`.pdf`);
            var stat = fs.statSync(`${__dirname}/../staticFiles/epubs/`+body.data.idEbook+`.pdf`);
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'application/pdf');
            file.pipe(res);
        }else{
            respond({success: false, errors: ["Fichier introuvable"]}, '/api/epub/get', req.idLog, res, 500)
        }
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/epub/get', req.idLog, res, 403)
    }
})

router.post('/generateCitation', (req, res)=>{
    let body = req.body

    if(tokens[body.token]){
        
        
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/epub/generateCitation', req.idLog, res, 403)
    }
})

module.exports = router;