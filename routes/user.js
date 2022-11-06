var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var db = require("../config/database");
var connection = mysql.createConnection(db);

/* GET users listing. */
router.get("/", function (req, res, next) {
  connection.query(
    "SELECT *, '********' As password FROM user JOIN role ON user.roleId = role.idRole",
    (err, result) => {
      res.send(result);
      if (err) {
        console.log(err);
      }
    },
  );
});

router.get("/:id", function (req, res, next) {
  connection.query(
    "SELECT *, '********' As password FROM user JOIN role ON user.roleId = role.idRole WHERE idUser = ?",
    [req.params["id"]],
    (err, result) => {
      if (result.length > 0) {
        res.send(result[0]);
      } else {
        res.sendStatus(404);
      }
      if (err) {
        console.log(err);
      }
    },
  );
});

/* GET users by roleId. */
router.get("/role/:id", function (req, res, next) {
  connection.query(
    "SELECT *, '********' As password  FROM user JOIN role ON user.roleId = role.idRole WHERE roleId = ?",
    [req.params["id"]],
    (err, result) => {
      res.send(result);
      if (err) {
        console.log(err);
      }
    },
  );
});

router.get("/roles/all", function (req, res, next) {
  connection.query("SELECT * FROM role", (err, result) => {
    res.send(result);
    if (err) {
      console.log(err);
    }
  });
});

/* LOGIN */
router.post("/login", function (req, res, next) {
  connection.query(
    "SELECT *, '********' As password  FROM user LEFT JOIN role ON user.roleId = role.idRole WHERE user.username = ? AND user.password = ?",
    [req.body.username, req.body.password],
    (err, result) => {
      if (result.length > 0) {
        res.send(result[0]);
      } else {
        res.sendStatus(404);
      }
      if (err) {
        console.log(err);
      }
    },
  );
});

/* ADD USER */
router.post("/new", function (req, res, next) {
  console.log(req.body);
  connection.query(`INSERT INTO user SET ?`, req.body, (err, result) => {
    res.send(result);
    if (err) {
      console.log(err);
    }
  });
});

/* EDIT USER */
router.put("/edit/:id", function (req, res, next) {
  console.log(req.body);
  connection.query(
    `UPDATE user SET ? WHERE idUser = ${req.params["id"]}`,
    [req.body],
    (err, result) => {
      res.send(result);
      if (err) {
        console.log(err);
      }
    },
  );
});

/* EDIT USER */
router.delete("/:id", function (req, res, next) {
  console.log(req.body);
  connection.query(
    `DELETE FROM user WHERE idUser = ${req.params["id"]}`,
    (err, result) => {
      res.send(result);
      if (err) {
        console.log(err);
      }
    },
  );
});

module.exports = router;
