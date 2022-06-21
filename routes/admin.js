const express = require('express');
const router = express.Router();

// import model file at the beginning of the file
const Question = require('../models/Question.js');



router.get('/', function (req, res, next){
    if(req.session.user){
        if(req.session.user.admin){
            let reportedQuestion = Question.reportedQuestion();
            let reportedAnswer = Question.reportedAnswer();
            reportedQuestion.forEach(object => {
                let category= object.id_category;
                object.nameCategory = Question.getCategory(category);
            })
            reportedAnswer.forEach(object => {
                let author_answer = object.author_answer;
                object.name_author = Question.getAuthor(author_answer);
            })
            res.render('admin', {information : req.session.user.first_name, reportedQuestions : reportedQuestion, reportedAnswers : reportedAnswer});
        }    


        else {
            res.redirect("/");
        }
    }else {
        res.redirect("/");
    }

});
router.get('/acceptQuestion', function (req, res, next){
    let idQuestion = req.query.idQuestion;
    if(req.session.user){
        if(req.session.user.admin){
            Question.unreportQuestion(idQuestion);
            res.redirect("/admin");
        }else{
            res.redirect("/");
        }
    }else{
        res.redirect("/");
    }

});

router.get('/removeQuestion', function (req, res, next){
    let idQuestion = req.query.idQuestion;
    if(req.session.user){
        if(req.session.user.admin){
            Question.deleteAllAnswerQuestion(idQuestion);
            Question.deleteQuestion(idQuestion);
            res.redirect("/admin");
        }else{
            res.redirect("/");
        }
    }else{
        res.redirect("/");
    }
    

});

router.get('/acceptCom', function (req, res, next){
    let idAnswer = req.query.idCom;
    if(req.session.user){
        if(req.session.user.admin){
            Question.unreportAnswer(idAnswer);
            res.redirect("/admin");
        }else{
            res.redirect("/");
        }
    }else{
        res.redirect("/");
    }

});

router.get('/removeCom', function (req, res, next){
    let idAnswer = req.query.idCom;
    if(req.session.user){
        if(req.session.user.admin){
            Question.deleteAnswer(idAnswer);
            res.redirect("/admin");
        }else{
            res.redirect("/");
        }
    }else{
        res.redirect("/");
    }
    

});

module.exports = router;