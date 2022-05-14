let Connection = require('./model/Connection')

let tokens = []

Connection.getTokenUser((rslt)=>{
    if(rslt.success){
        rslt.data.forEach((user)=>{
            if(user.token){
                tokens[user.token]= {idUser: user.id,
                                    roleUser: user.role}
            }
        })
    }
})

module.exports = tokens;