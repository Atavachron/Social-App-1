const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const app = express();

let sessionOptions = session({
  secret: "This is the secret!",
  store: new MongoStore({client: require('./db')}),
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})

app.use(sessionOptions);
app.use(flash());

app.use(function(req, res, next) {
  //Make current user id available on the req object
  if (req.session.user) {
    req.visitorId = req.session.user._id;
  } else {
    req.visitorId = 0;
  }
  
  //Make user session data available from within templates
  res.locals.user = req.session.user;
  next();
});

const port = process.env.PORT || 3000;
const router = require('./router.js');


app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.set('views', 'views');
app.set('view engine', 'ejs');  

app.use('/', router);

module.exports = app;
