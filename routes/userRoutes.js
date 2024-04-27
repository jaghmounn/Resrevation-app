const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.Register); //logique metier


router.get('/signup', (req,res) => {    //adhouma bch yjibou les forms 
    res.render('signup'); 
}) ; 




router.get('/login', (req,res) => {
    res.render('session'); 
}) ; 



router.post('/login', userController.SignIn);

module.exports = router;
 