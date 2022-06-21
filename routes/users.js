const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const saltRounds = 10;

// import model file at the beginning of the file
const Question = require('../models/Question.js');
const User = require('../models/User.js');

// TODO create your controllers
router.get('/', function(req, res, next) {
    if (req.session.errorConnexion) {
        error = req.session.errorConnexion;
        req.session.errorConnexion = undefined;
        res.render('signIn', {info : error});
    } else {
        res.render('signIn');
    }
});



router.post('/logins', function(req, res, next) {
    let email = req.body.username;
    let password = req.body.password;
    console.log(password);
    let mailformat = '@student.vinci.be';
    let mailformat2 = '@vinci.be';
    if(email.endsWith(mailformat2) || email.endsWith(mailformat))
    {
        console.log("Valid email address!");
    } else {
        req.session.errorConnexion = 'Invalid email address';
        return res.redirect('/users');
    }
    let passwordOk = User.connexion(email);

    if(passwordOk === undefined){
        req.session.errorConnexion = 'Account does not exist';
        return res.redirect('/users');
    }
    if (bcrypt.compareSync(password, passwordOk.password)){
        console.log("LOGIN");
        req.session.user = User.userInfo(email);
        console.log(req.session.user);
        if(req.session.user.admin === 1 || req.session.user.admin === true){
            return res.redirect("/admin");
        } else {
            return res.redirect("/members");
        }
    
    } else {
        req.session.errorConnexion = 'Incorrect password';
        return res.redirect('/users');
    }
    
});


router.get('/register', function(req, res, next) {
    if (req.session.errorConnexion) {
        error = req.session.errorConnexion;
        req.session.errorConnexion = undefined;
        res.render('register', {info : error});
      } else {
        res.render('register');
      }
});

router.post('/signUp', function(req, res, next) {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password2;

    let mailformat = '@student.vinci.be';
    let mailformat2 = '@vinci.be';
    if(email.endsWith(mailformat2) || email.endsWith(mailformat))
    {
        console.log("Valid email address!");
    } else {
        req.session.errorConnexion = 'Invalid address';
        return res.redirect('/users/register');
    }
    if(password !== password2){
        req.session.errorConnexion = 'The passwords are not same';
        return res.redirect('/users/register');
    }

    if(User.email(email) !== undefined){
        req.session.errorConnexion = 'The email already used';
        return res.redirect('/users/register');
    }
    req.session.errorConnexion = 'Your account has been created';
    const hash = bcrypt.hashSync(password, saltRounds);
    User.save(firstname, lastname, email, hash);
    res.redirect('/');
});

router.get('/logout', function(req, res, next) {
    console.log("se déconnecter");
    req.session.destroy();
    console.log("destroy session");
    res.redirect('/');
});


module.exports = router;