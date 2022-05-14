let responseSender = (data, reqName, idLog, res, status=200)=>{
    if(!data.success && data.errors && data.errors[0].includes("Problème db : ")) status = 500
    // console.log(idLog+ ' : ' + Date.now()+' : '+reqName+' : res.data = '+JSON.stringify(data))
    res.status(status).json(data)
}

module.exports = responseSender