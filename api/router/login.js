let express = require('express')
let router = express.Router();
let bcrypt = require('bcryptjs')

let respond = require('../ResponseSender')

let Connection = require('../model/Connection')

let tokens = require('../tokens')

function strRandom(o) {
    var a = 10,
        b = 'abcdefghijklmnopqrstuvwxyz',
        c = '',
        d = 0,
        e = ''+b;
    if (o) {
      if (o.startsWithLowerCase) {
        c = b[Math.floor(Math.random() * b.length)];
        d = 1;
      }
      if (o.length) {
        a = o.length;
      }
      if (o.includeUpperCase) {
        e += b.toUpperCase();
      }
      if (o.includeNumbers) {
        e += '1234567890';
      }
    }
    for (; d < a; d++) {
      c += e[Math.floor(Math.random() * e.length)];
    }
    return c;
}

let generatToken = (nb)=>{
    let res = strRandom({
        includeUpperCase: true,
        includeNumbers: true,
        length: nb,
        startsWithLowerCase: true
      });
    while(tokens[res]){
        res = strRandom({
            includeUpperCase: true,
            includeNumbers: true,
            length: nb,
            startsWithLowerCase: true
          });
    }
    return res;
}

router.post('/', (req, res)=>{

    let body = req.body.data;

    Connection.verifyLogin(body.email, (rslt)=> {
        if (rslt.success){
            bcrypt.compare(body.pass, rslt.data.pass, (err, hashRslt)=>{
                if(hashRslt){
                    token = generatToken(20);
                    tokens[token] = { idUser: rslt.data.idUser,
                                      roleUser: rslt.data.role}

                    Connection.setToken([token, rslt.data.idUser], (result)=>{
                        respond({ success: true, 
                                data: { token: token, 
                                        idUser: rslt.data.idUser, 
                                        roleUser: rslt.data.role,
                                        img : rslt.data.img
                                        }
                            }, "/api/login", req.idLog, res)
                    })

                }else{
                    respond({success: false,
                            errors: ['Le mot de passe ne correspond pas']}, "/api/login", req.idLog, res)
                }
            })
        }else{
            respond(rslt, "/api/login", req.idLog, res)
        }
    })
})

router.post('/isLoggedIn', (req, res)=>{

    let body = req.body

    if(tokens[body.token]){
        respond({
            success : true,
            data : tokens[body.token]
        },'/api/login/isLoggedIn',req.idLog, res)

    }else{
        respond({
            success : false
        }, '/api/login/isLoggedIn', req.idLog, res, 200)
    }
})

router.post('/logout', (req, res)=>{

    let body = req.body

    if(tokens[body.token]){
        Connection.removeToken(tokens[body.token].idUser, rslt =>{
            if(rslt.success){
                tokens[body.token] = undefined
                respond({
                    success : true
                },'/api/login/logout',req.idLog, res)    
            }else{
                respond({
                    success : false
                }, '/api/login/logout', req.idLog, res, 200)
            }
        })
    }else{
        respond({
            success : false
        }, '/api/login/logout', req.idLog, res, 200)
    }
})

module.exports = router;