const express = require('express');
const router = express.Router();

// import model file at the beginning of the file
const Question = require('../models/Question.js');

router.get('/', function(req, res, next) {
    if(req.session.user){
        console.log(req.session.user);
        let openQuestion = Question.openQuestionUser(req.session.user.id_user);
        let resolvedQuestion = Question.resolvedQuestionUser(req.session.user.id_user);
        openQuestion.forEach(object =>{
            let category = object.id_category;
            object.nameCategory = Question.getCategory(category);
         })
         resolvedQuestion.forEach(object =>{
            let category = object.id_category;
            object.nameCategory = Question.getCategory(category);
         })
        res.render('member', {information: req.session.user.first_name, openQuestions : openQuestion, resolvedQuestions : resolvedQuestion});
        }
    
    else {
        res.redirect("/");
    }
});


module.exports = router;