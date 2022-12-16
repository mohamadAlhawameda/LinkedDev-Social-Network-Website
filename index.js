var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
const config = require("./config/database")
var signupRouter = require('./routes/signup');
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout")
const profileRouter = require("./routes/profileEdit")
const passport = require("passport");
const session = require("express-session");
const activatePassport = require("./config/passport");
var forumRouter = require('./routes/forum');
var indexRouter = require("./routes/index")
var dashboardRouter = require('./routes/dashboard');
var usersRouter = require('./routes/users');
var userConnectRouter = require('./routes/userConnect')
const mongoose = require("mongoose");
var dbName = "finalProjTest";
mongoose.connect("mongodb+srv://broozey:JEMM123@cluster0.bxvrack.mongodb.net/FinalProjectDB")
let dbconnection = mongoose.connection;
dbconnection.once("open", () => { console.log("Connected to mongodb") });
dbconnection.on("error", () => { console.log("Failed to execute db command") });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap')))
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery')))

app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {}
}))
activatePassport(passport);
app.use(passport.initialize())
app.use(passport.session())
app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next()
})


app.use('/', indexRouter);

app.use('/dashboard', dashboardRouter);
app.use('/users', usersRouter);
app.use('/userConnect', userConnectRouter);

app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use("/profile", profileRouter)

app.use('/forum', forumRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
