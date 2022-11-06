var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var db = require("../config/database");
var connection = mysql.createConnection(db);

/* GET users listing. */
router.get("/", function (req, res, next) {
  connection.query("SELECT * FROM test", (err, result) => {
    res.send(result);
    if (err) {
      console.log(err);
    }
  });
});

router.get("/:id", function (req, res, next) {
  connection.query(
    "SELECT * FROM test WHERE idTest = ?",
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

/* ADD USER */
router.post("/new", function (req, res, next) {
  console.log(req.body);
  connection.query(`INSERT INTO test SET ?`, req.body, (err, result) => {
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
    `UPDATE test SET ? WHERE idTest = ${req.params["id"]}`,
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
    `DELETE FROM test WHERE idTest = ${req.params["id"]}`,
    (err, result) => {
      res.send(result);
      if (err) {
        console.log(err);
      }
    },
  );
});

module.exports = router;
