const User = require('../models/User.js')


//Login using a callback function :
// exports.login = function(req, res) {
//   let user = new User(req.body);
//   user.login(function(result) {
//     res.send(result)
//   });
// }

exports.login = function(req, res) {
  let user = new User(req.body);
  user.login().then(result => {
    res.send(result)
  }).catch(e => {
    res.send(e);
  });
}


exports.logout = function() {
  
}

exports.register = function(req, res) {
  let user = new User(req.body);
  user.register();
  if (user.errors.length) {
    res.send(user.errors)
  } else {
    res.send("Congrats")
  }
}

exports.home  = function(req, res) {
  res.render('home-guest');
}
