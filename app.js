const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const app = express();
const markdown = require('marked');
const sanitizeHTML = require('sanitize-html')

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
  //Make markdown available from ejs templates
  res.locals.filterUserHTML = function(content) {
    return sanitizeHTML(markdown(content), {allowedTags: ['p', 'br', 'ul', 'ol', 'li', 'strong', 'bold', 'i', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], allowedAttributes: {}});
  }

  //Make all error and success flash messages available from all templates
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");
  
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

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.use(function(socket, next) {
  sessionOptions(socket.request, socket.request.res, next)
})

io.on('connection', function(socket) {
  if (socket.request.session.user) {
    let user = socket.request.session.user
    socket.on('chatMessageFromBrowser', (data) => {
      io.emit('chatMessageFromServer', {message: data.message, username: user.username, avatar: user.avatar})
    })
  }
})


module.exports = server;
