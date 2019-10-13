const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController')

router.get('/', userController.home);
router.post('/register', userController.register)

module.exports = router;




// const express = require('express');
// const router = express.Router();

// router.get('/', (req, res) => {
//   res.render('home-guest')
// })

// module.exports = router; 