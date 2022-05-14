let cors = require('cors')
let express = require('express')
let app = express()
require('dotenv').config()

let multer = require('multer')

app.set('view engine', 'ejs')

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(express.static('staticFiles'))

app.use(express.json())

let idLog = 0


app.use((req,res,next)=>{
    idLog++
    console.log(idLog+ ' : ' + Date.now()+' : '+req.url+' : req.body = '+JSON.stringify(req.body));
    req.idLog = idLog
    next()
})

let upload = multer()

app.post('/api/ebook/add', upload.single('file'), (req, res, next)=>{
    req.body.data = JSON.parse(req.body.data);
    next()
})


app.use("/api", require('./VerifyPost'))

app.use('/api/login', require('./router/login'))

app.use('/api/ebook', require('./router/ebook'))

app.use('/api/comment', require('./router/comment'))

app.use('/api/favoris', require('./router/favoris'))

app.use('/api/type', require('./router/type'))

app.use('/api/press', require('./router/press'))

app.use('/api/epub', require('./router/epub'))

app.listen(8080, ()=>console.log('Connected to 8080'))