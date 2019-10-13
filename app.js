const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = require('./router.js');

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.set('views', 'views');
app.set('view engine', 'ejs');  

app.use('/', router);

app.listen(port, () => console.log(`Server listening on port ${port}`));
