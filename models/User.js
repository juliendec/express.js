const db = require('../models/db_conf.js');

module.exports.listMembers = () => {
    const members = db.prepare("SELECT * FROM users");
    return members.all();
};
  
module.exports.save = (firstname, lastname, email, password) => {
  // use of prepared statement with parameters
  const members = db.prepare('INSERT INTO users (first_name, last_name, e_mail, password, admin) VALUES (?, ?, ?, ?, false)');
  const info = members.run(firstname, lastname, email, password);
  console.log("users model save" + info.changes);
};


module.exports.connexion = (email) => {
  const members = db.prepare("SELECT password FROM users WHERE e_mail = ?");
  const info = members.get(email);
  return info;
};

module.exports.userInfo = (email) => {
  const members = db.prepare("SELECT * FROM users WHERE e_mail = ?");
  const info = members.get(email);
  return info;
};

module.exports.email = (email) => {
  const members = db.prepare("SELECT e_mail FROM users WHERE e_mail = ?");
  const info = members.get(email);
  return info;
};