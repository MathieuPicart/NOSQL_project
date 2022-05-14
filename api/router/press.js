let express = require('express')
let router = express.Router();

let respond = require('../ResponseSender')

let Press = require('../model/Press')

let tokens = require('../tokens')

router.post('/add', (req, res)=>{

    let token = req.body.token
    let data = req.body.data

    if(tokens[token] && tokens[token].roleUser===3){
        Press.add(data, (rslt) => {
            respond(rslt, "/api/press/add", req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/press/add', req.idLog, res, 403)
    }
})

router.post('/delete', (req, res)=>{

    let token = req.body.token
    let data = req.body.data

    if(tokens[token] && tokens[token].roleUser===3){
        Press.delete(data.idPress, (rslt) => {
            respond(rslt, "/api/press/delete", req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/press/delete', req.idLog, res, 403)
    }
})

router.post('/gets', (req, res)=>{

    let body = req.body

    if(tokens[body.token] && tokens[token].roleUser===3){
        Press.gets((rslt) => {
            respond({
                success : true,
                data: rslt.data
            }, '/api/press/gets', req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/press/gets', req.idLog, res, 403)
    }
})

router.post('/updt', (req, res)=>{

    let token = req.body.token
    let data = req.body.data

    if(tokens[token] && tokens[token].roleUser===3){
        Press.updt(data, (rslt) => {
            respond(rslt, '/api/press/updt', req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/press/updt', req.idLog, res, 403)
    }
})

router.post('/addPress_Comment', (req, res)=>{

    let token = req.body.token
    let data = req.body.data

    if(tokens[token] && tokens[token].roleUser===3){
        Press.addComment(data, (rslt) => {
            respond(rslt, '/api/press/addPress_Comment', req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/press/addPress_Comment', req.idLog, res, 403)
    }
})

router.post('/deletePress_Comment', (req, res)=>{

    let token = req.body.token
    let data = req.body.data

    if(tokens[token] && tokens[token].roleUser===3){
        Press.deleteComment(data.idPress_Comment, (rslt) => {
            respond(rslt, '/api/press/deletePress_Comment', req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/press/deletePress_Comment', req.idLog, res, 403)
    }
})

router.post('/updtPress_Comment', (req, res)=>{

    let token = req.body.token
    let data = req.body.data

    if(tokens[token] && tokens[token].roleUser===3){
        Press.updtComment(data, (rslt) => {
            respond(rslt, '/api/press/updtPress_Comment', req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/press/updtPress_Comment', req.idLog, res, 403)
    }
})

router.post('/getPress_Comment', (req, res)=>{

    let token = req.body.token
    let data = req.body.data

    if(tokens[token] && tokens[token].roleUser===3){
        Press.getPress_Comment((rslt) => {
            respond({
                success : true,
                data: rslt.data
            }, '/api/press/getPress_Comment', req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/press/getPress_Comment', req.idLog, res, 403)
    }
})

module.exports = router;