
const express = require('express');
const session = require('express-session');
const app = express();

let sessionOptions = session({
  secret: "This is the secret!",
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})

app.use(sessionOptions);

const port = process.env.PORT || 3000;
const router = require('./router.js');


app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.set('views', 'views');
app.set('view engine', 'ejs');  

app.use('/', router);

module.exports = app;
