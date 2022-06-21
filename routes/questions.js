const express = require('express');
const router = express.Router();

// import model file at the beginning of the file
const Question = require('../models/Question.js');
const { all } = require('./admin.js');

// TODO create your controllers
router.get('/', function(req, res, next) {
    let allQuestion

    if(req.query.title === "" || req.query.title === undefined ){
        allQuestion = Question.listQuestions();
     if(req.query.category === undefined || req.query.category === ""){
        allQuestion = Question.listQuestions();
    }else{
        let category_selected = req.query.category;
        allQuestion = Question.listQuestionsByCategory(category_selected);
    }
    } else {
        let search_title = req.query.title;
        allQuestion = Question.searchQuestion(search_title);
        console.log("looool" + allQuestion);
    }

   

    

    allQuestion.forEach(object =>{
        let category = object.id_category;
        object.nameCategory = Question.getCategory(category);
    
    })
    console.log(allQuestion);
    res.render('homepage', {questions : allQuestion, category : Question.listCategory()});
});

router.get('/questions', function(req, res, next) {
    let idQuestion = req.query.idQuestion;
    let info = Question.getQuestion(idQuestion)
    let category = Question.getCategory(info.id_category);
    let author = Question.getAuthor(info.author_question);
    let haveSolution = false;
    let allAnswer = Question.getAnswer(idQuestion);
    console.log(info);

    allAnswer.forEach(object =>{
        let author = object.author_answer;
        object.author_answer = Question.getAuthor(author);
        if(object.correct === true || object.correct === 1){
            haveSolution = true;
            object.is_right = 'accepted_answer';
        }
    })

    if (req.session.errorAddAnswer) {
        error = req.session.errorAddAnswer;
        req.session.errorAddAnswer = undefined;
        console.log(error);
        res.render('questionpage', {questions : info, category : category, author : author, answers : allAnswer, answerSolution : haveSolution, errorAnswer : error});
    } else {
        res.render('questionpage', {questions : info, category : category, author : author, answers : allAnswer, answerSolution : haveSolution});
    }
    
});

router.post('/reportQuestion', function(req, res, next) {
    let idQuestion = req.body.id_question;
    Question.reportQuestion(idQuestion);
    res.redirect('/questions?idQuestion=' + idQuestion);
});

router.post('/reportCom', function(req, res, next) {
    let idQuestion = req.body.id_question;
    let idAnswer = req.body.id_answer;
    console.log(idQuestion);
    Question.reportCom(idAnswer);
    res.redirect('/questions?idQuestion=' + idQuestion);
});

router.get('/add', function(req, res, next) {
    if(req.session.user){
        if (req.session.errorQuestion) {
            error = req.session.errorQuestion;
            req.session.errorQuestion = undefined;
            res.render('addQuestion', {info : error, category : Question.listCategory()});
          } else {
            res.render('addQuestion', {category : Question.listCategory()});
          }
        
        }else{
            res.redirect('/users');
            return;
        }

    if (req.session.errorQuestion) {
        error = req.session.errorQuestion;
        req.session.errorQuestion = undefined;
        res.render('addQuestion', {info : error});
      } else {
        res.render('addQuestion');
      }
    
});

router.post('/addQuestion', function(req, res, next) { 
    let idQuestion = req.body.id_question;
    let title = req.body.title;
    let subject = req.body.subject;
    let id_category = req.body.category;
    let author_question = req.session.user.id_user;
    
    if(title === ""){
        req.session.errorQuestion = 'No title';
        return res.redirect('/add');
    }else{

    if(subject === ""){
        req.session.errorQuestion = 'No subject';
        return res.redirect('/add');
    }else{
    
    let addedQuestion = Question.addQuestion(title, subject, id_category, author_question);

    console.log("info question added : " + addedQuestion.id_question)
    console.log("Question added !");
    return res.redirect('/questions?idQuestion=' + addedQuestion.id_question);
    }
}

});

router.post('/reponses', function(req, res, next) {
    let id_question = req.body.id_question;
    let id_user = req.body.id_user;
    let subject = req.body.subject;
    if(subject === "" || subject === " "){
        req.session.errorAddAnswer = 'Your answer must be in characters.';
        res.redirect('/questions?idQuestion=' + id_question);
        return;
    }
    Question.addAnswer(subject, id_user, id_question)
    res.redirect('/questions?idQuestion=' + id_question);
})

router.post('/validate', function(req, res, next) {
    let id_question = req.body.id_question;
    let id_answer = req.body.id_answer;
    Question.acceptCom(id_answer);
    Question.acceptQuestion(id_question);
    res.redirect('/questions?idQuestion=' + id_question);
})

module.exports = router;