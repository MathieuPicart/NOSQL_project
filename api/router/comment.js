let express = require('express')
let router = express.Router();

let respond = require('../ResponseSender')

let Comment = require('../model/Comment')

let tokens = require('../tokens')

router.post('/add', (req, res)=>{

    let token = req.body.token
    let data = req.body.data

    if(tokens[token]){
        data.idUser = tokens[token].idUser
        Comment.add(data, (rslt) => {
            respond(rslt, "/api/comment/add", req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/comment/add', req.idLog, res, 403)
    }
})

router.post('/delete', (req, res)=>{

    let token = req.body.token
    let data = req.body.data

    if(tokens[token]){
        Comment.delete(data.idComment, (rslt) => {
            respond(rslt, "/api/comment/delete", req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/comment/delete', req.idLog, res, 403)
    }
})

router.post('/updt', (req, res)=>{

    let token = req.body.token
    let data = req.body.data

    if(tokens[token]){
        Comment.updt(data, (rslt) => {
            respond(rslt, "/api/comment/updt", req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/comment/updt', req.idLog, res, 403)
    }
})

module.exports = router;