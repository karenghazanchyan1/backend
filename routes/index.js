var express = require('express');
var router = express.Router();
var emailR = new RegExp("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])");
var tokenList = [];
var { findUser, getUsers, addUser, updateUser, deleteUser } = require('../services/users');
var { findClass, getClasses, addClass, updateClass, deleteClass } = require('../services/classes');

/* New user */
/*
  Gets:
    name>=2, surname>=3, username>=5, password>=8,
    email(regex), problem(json stringified array)  
*/
router.post('/newUser', function (req, res, next) {
  if (req.name.length < 2) {
    res.status = 411;
    res.send("Name can't be this short");
  } else if (req.surname.length < 3) {
    res.status = 411;
    res.send("Surname can't be this short");
  } else if (req.username.length < 5) {
    res.status = 411;
    res.send("Username can't be this short");
  } else if (req.password.length < 8) {
    res.status = 411;
    res.send("Password can't be this short");
  } else if (emailR.test(req.email.length)) {
    res.status = 400;
    res.send("Email is not valid");
  } else {
    addUser({
      name: req.name,
      surname: req.surname,
      username: req.username,
      password: req.password,
      problem: req.problem,
      email: req.email,
      classes: "[]"
    }).then((data) => {
      res.status = 200;
      res.send(data);
    }).catch((err) => {
      res.status = 500;
      res.send(err);
    });
  }
});

/* New token */
/*
  Gets:
    username, password
  Returns:
    New token
*/
router.get('/newToken', function (req, res, next) {
  findUser(req.username).then((data) => {
    if (data.password == req.passsword) {
      res.status = 200;
      let token = (new Date()).getTime();
      tokenList.push({ username: req.username, token });
      res.send(token);
    } else {
      res.status = 403;
      res.send("wrong password");
    }
  }).catch((err) => {
    res.status = 500;
    res.send("wrong username");
  });
});

/* Get user info */
/*
  Gets:
    token
  Returns:
    All user info but password
*/
router.get('/userInfo', function (req, res, next) {
  let hasAccess = false;
  for (let i in tokenList) {
    if (tokenList[i].token == req.token) {
      hasAccess = true;
      findUser(tokenList[i].username).then((data) => {
        data.password = "";
        res.status = 200;
        res.send(data);
      }).catch((err) => {
        res.status = 500;
        res.send(err);
      });
    }
  }
  if (!hasAccess) {
    res.status = 401;
    res.send("Unauthorized");
  }
});

/* Change user info */
/*
  Gets:
    token, name>=2, surname>=3, username>=5, password>=8,
    email(regex), problem(json stringified array),
    classes(json stringified array)
  Returns:
    All user info but password
*/
router.post('/userInfo', function (req, res, next) {
  let hasAccess = false;
  for (let i in tokenList) {
    if (tokenList[i].token == req.token) {
      hasAccess = true;
      if (req.name.length < 2) {
        res.status = 411;
        res.send("Name can't be this short");
      } else if (req.surname.length < 3) {
        res.status = 411;
        res.send("Surname can't be this short");
      } else if (req.username.length < 5) {
        res.status = 411;
        res.send("Username can't be this short");
      } else if (req.password.length < 8) {
        res.status = 411;
        res.send("Password can't be this short");
      } else if (emailR.test(req.email.length)) {
        res.status = 400;
        res.send("Email is not valid");
      } else {
        updateUser(tokenList[i].username, {
          name: req.name,
          surname: req.surname,
          username: req.username,
          password: req.password,
          problem: req.problem,
          email: req.email,
          classes: req.classes
        }).then((data) => {
          data.password = "";
          res.status = 200;
          res.send(data);
        }).catch((err) => {
          res.status = 500;
          res.send(err);
        });
      }
    }
  }
  if (!hasAccess) {
    res.status = 401;
    res.send("Unauthorized");
  }
});

/* Delete user */
/*
  Gets:
    token, username, password
*/
router.delete('/user', function (req, res, next) {
  let hasAccess = false;
  for (let i in tokenList) {
    if (tokenList[i].token == req.token) {
      hasAccess = true;
      findUser(tokenList[i].username).then((data) => {
        if (req.password == data.password && req.username == data.username) {
          deleteUser(tokenList[i].username).then((data) => {
            res.status = 200;
            res.send(data);
          }).catch((err) => {
            res.status = 500;
            res.send(err);
          });
        } else {
          res.status = 401;
          res.send("Unauthorized");
        }
      }).catch((err) => {
        res.status = 500;
        res.send(err);
      });
    }
  }
  if (!hasAccess) {
    res.status = 401;
    res.send("Unauthorized");
  }
});

/* Get user classes */
/*
  Gets:
    token
  Returns:
    All user classes
*/
router.get('/classes', function (req, res, next) {
  let hasAccess = false;
  for (let i in tokenList) {
    if (tokenList[i].token == req.token) {
      hasAccess = true;
      findUser(tokenList[i].username).then((data) => {
        let arr = JSON.parse(data.classes);
        let arr_ = [];
        for (let i in arr) {
          findClass(arr[i]).then((data) => {
            arr_.push(data);
            if (arr_.length == arr.length) {
              res.status = 200;
              res.send(arr_);
            }
          }).catch((err) => {
            res.status = 500;
            res.send(err);
          });
        }
      });
    }
  }
  if (!hasAccess) {
    res.status = 401;
    res.send("Unauthorized");
  }
});

/* Get class */
/*
  Gets:
    token, class code(in api)
  Returns:
    Class
*/
router.get('/class/:code', function (req, res, next) {
  let hasAccess = false;
  for (let i in tokenList) {
    if (tokenList[i].token == req.token) {
      hasAccess = true;
      findUser(tokenList[i].username).then((data) => {
        if (JSON.parse(data.classes).indexOf(req.params.code != -1)) {
          findClass(req.params.code).then((data) => {
            res.status = 200;
            res.send(data);
          }).catch((err) => {
            res.status = 500;
            res.send(err);
          });
        } else {
          res.status = 403;
          res.send("Access forbidden");
        }
      });
    }
  }
  if (!hasAccess) {
    res.status = 401;
    res.send("Unauthorized");
  }
});


module.exports = router;
