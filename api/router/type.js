let express = require('express')
let router = express.Router();

let respond = require('../ResponseSender')

let Type = require('../model/Type')

let tokens = require('../tokens')

router.post('/add', (req, res)=>{

    let token = req.body.token
    let data = req.body.data

    if(tokens[token] && tokens[token].roleUser===3){
        Type.add(data.name, (rslt) => {
            respond(rslt, "/api/type/add", req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/type/add', req.idLog, res, 403)
    }
})

router.post('/delete', (req, res)=>{

    let token = req.body.token
    let data = req.body.data

    if(tokens[token] && tokens[token].roleUser===3){
        Type.delete(data.idType, (rslt) => {
            respond(rslt, "/api/type/delete", req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/type/delete', req.idLog, res, 403)
    }
})

router.post('/gets', (req, res)=>{

    let body = req.body

    if(tokens[body.token] && tokens[token].roleUser===3){
        Type.gets((rslt) => {
            respond({
                success : true,
                data: rslt.data
            }, '/api/type/gets', req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/type/gets', req.idLog, res, 403)
    }
})

router.post('/updt', (req, res)=>{

    let token = req.body.token
    let data = req.body.data

    if(tokens[token] && tokens[token].roleUser===3){
        Type.updt(data, (rslt) => {
            respond(rslt, '/api/type/updt', req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/type/updt', req.idLog, res, 403)
    }
})

module.exports = router;