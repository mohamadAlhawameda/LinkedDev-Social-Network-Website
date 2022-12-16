var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/developers', function (req, res) {
    res.render('dev', { title: 'Developers' })
})

module.exports = router;