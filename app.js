require('express-async-errors');
require('dotenv').config()

var express = require('express');
var cookieParser = require('cookie-parser');
var multer = require("multer");
var logger = require('morgan');
var cors = require("cors");
var path = require('path');
var createError = require('http-errors');

var app = express();

const indexRoute = require("./routes/index");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");


app.set('trust proxy', 1) // trust first proxy
app.use(cors({
	origin: ["http://localhost:3000"],
	methods: ["GET", "POST"],
	credentials: true,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use(cookieParser());


// Serve static files from the React app
app.use("/images", express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images");
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	},
});

const upload = multer({
	storage: storage
});

app.post("/api/upload", upload.single("file"), (req, res) => {
	try {
		return res.status(200).json("File uploded successfully");
	} catch (error) {
		console.error(error);
	}
});
app.use('/api', indexRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// catch 404 and forward to error handlers
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	console.log(err);
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send(err.message || 'error');
});

module.exports = app;