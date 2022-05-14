let express = require('express')
let router = express.Router();

let respond = require('../ResponseSender')

let Favoris = require('../model/Favoris')

let tokens = require('../tokens')

router.post('/add', (req, res) => {

    let token = req.body.token
    let data = req.body.data

    if(tokens[token]){
        data.idUser = tokens[token].idUser
        Favoris.add(data, (rslt) => {
            respond(rslt, "/api/favoris/add", req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/favoris/add', req.idLog, res, 403)
    }
})

router.post('/delete', (req, res) => {

    let token = req.body.token
    let data = req.body.data

    if(tokens[token]){
        data.idUser = tokens[token].idUser
        Favoris.delete(data, (rslt) => {
            respond(rslt, "/api/favoris/delete", req.idLog, res)
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/favoris/delete', req.idLog, res, 403)
    }
})

router.post('/gets', (req, res)=>{

    let token = req.body.token

    if(tokens[token]){
        let idUser = tokens[token].idUser
        Favoris.gets(idUser, (rslt) => {
            if (rslt.success) {
                respond({ success: true, 
                          data: rslt.data
                }, "/api/favoris/gets", req.idLog, res)
            }else{
                respond(rslt, "/api/favoris/gets", req.idLog, res)
            }
        })
    }else{
        respond({
            success : false,
            errors: ["Pas les droits"]
        }, '/api/favoris/gets', req.idLog, res, 403)
    }
})

module.exports = router;