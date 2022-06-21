const db = require('../models/db_conf.js');

module.exports.listQuestions = () => {
    const questions = db.prepare("SELECT * FROM questions WHERE resolved=false ORDER BY date_question desc LIMIT 20 ");
    return questions.all();
};

module.exports.listQuestionsByCategory = (id) => {
    const questions = db.prepare("SELECT * FROM questions WHERE id_category = ?");
    return questions.all(id);
};

module.exports.searchQuestion = (texte) =>{
    const question = db.prepare("SELECT * FROM questions WHERE LOWER(title) LIKE LOWER(?)");
    return question.all("%" +texte + "%");
}
module.exports.getQuestion = (id) => {
    const question = db.prepare("SELECT * FROM questions WHERE id_question = ?");
    const info = question.get(id);
    return info;
};

module.exports.getCategory = (id) => {
    const category = db.prepare("SELECT category_title FROM categories WHERE id_category = ?");
    const info = category.get(id);
    return info;
};

module.exports.listCategory = () => {
    const category = db.prepare("SELECT * FROM categories");
    return category.all();
}

module.exports.getAuthor = (id) => {
    const author = db.prepare("SELECT first_name FROM users WHERE id_user = ?");
    const info = author.get(id);
    return info;
};

module.exports.getAnswer = (id) => {
    const answer = db.prepare("SELECT * FROM answers WHERE id_question = ? ORDER BY date_answer desc");
    return answer.all(id);
};

module.exports.reportQuestion = (id) => {
    const select = db.prepare('UPDATE questions SET reported = true WHERE id_question = ?');
    let info = select.run(id);
    console.log("users model update " + info.changes);
};

module.exports.reportCom = (id) => {
    const select = db.prepare('UPDATE answers SET reported = true WHERE id_answer = ?');
    let info = select.run(id);
    console.log("users model update " + info.changes);
  };

module.exports.addQuestion = (title, subject, id_category, author_question) => {
    const question = db.prepare('INSERT INTO questions (title, subject, resolved, reported, id_category, author_question) VALUES (?, ?, 0, 0, ?, ?) RETURNING *');
    const info = question.get(title, subject, id_category, author_question);
    return info;
};

module.exports.addAnswer = (subject, author_answer, id_question) => {
    const question = db.prepare('INSERT INTO answers (subject, reported, correct, author_answer, id_question) VALUES (?, 0, 0, ?, ?)');
    const info = question.run(subject, author_answer, id_question);
    console.log("question save"+ info.changes);
};

module.exports.acceptCom = (id) => {
    const select = db.prepare('UPDATE answers SET correct = true WHERE id_answer = ?');
    let info = select.run(id);
    console.log("users model update " + info.changes);
  };

module.exports.acceptQuestion = (id) => {
    const select = db.prepare('UPDATE questions SET resolved = true WHERE id_question = ?');
    let info = select.run(id);
    console.log("users model update " + info.changes);
}

  module.exports.openQuestionUser = (id) => {
      const question = db.prepare('SELECT * FROM questions WHERE author_question = ? AND resolved = false');
      return question.all(id);
  }

  module.exports.resolvedQuestionUser = (id) => {
    const question = db.prepare('SELECT * FROM questions WHERE author_question = ? AND resolved = true');
    return question.all(id);
}

 module.exports.reportedQuestion = () => {
     const question = db.prepare('SELECT * FROM questions WHERE reported = true');
     let info = question.all();
    console.log(info);
    return info;
 }

 module.exports.reportedAnswer = () => {
    const answer = db.prepare('SELECT * FROM answers WHERE reported = true');
    return answer.all();
}

module.exports.unreportQuestion = (id) => {
    const question = db.prepare('UPDATE questions SET reported = false WHERE id_question = ?');
    let info = question.run(id);
    console.log("reported question update " + info.changes);
}

module.exports.deleteQuestion = (id) => {
    const question = db.prepare('DELETE FROM questions WHERE id_question = ?');
    let info = question.run(id);
    console.log("deleted question : " + id);
}

module.exports.deleteAllAnswerQuestion = (id) =>{
    const answer = db.prepare('DELETE FROM answers WHERE id_question = ?');
    let info = answer.run(id);
    console.log("deleted answers : " + id);
}

module.exports.unreportAnswer = (id) => {
    const answer = db.prepare('UPDATE answers SET reported = false WHERE id_answer = ?');
    let info = answer.run(id);
    console.log("reported answer update " + info.changes);
}

module.exports.deleteAnswer = (id) => {
    const answer = db.prepare('DELETE FROM answers WHERE id_answer = ?');
    let info = answer.run(id);
    console.log("deleted answer : " + id);
}
