var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var db = require("../config/database");
var connection = mysql.createConnection(db);

/* GET users listing. */
router.get("/", function (req, res, next) {
  connection.query(
    "SELECT *, IFNULL((SELECT json_object('testId',testId,'rangeFrom',rangeFrom,'rangeTo',rangeTo,'notice',notice) FROM testRange WHERE testRange.testId = test.idTest AND testRange.testRangeSex = 'male' LIMIT 1),'[]') As male, IFNULL((SELECT json_object('testId',testId,'rangeFrom',rangeFrom,'rangeTo',rangeTo,'notice',notice) FROM testRange WHERE testRange.testId = test.idTest AND testRange.testRangeSex = 'female' LIMIT 1),'[]') As female FROM test",
    (err, result) => {
      if (result.length > 0) {
        result = result.map((row) => ((row.male = JSON.parse(row.male)), row));
        result = result.map(
          (row) => ((row.female = JSON.parse(row.female)), row),
        );
        res.send(result);
        if (err) {
          console.log(err);
        }
      }
    },
  );
});

router.get("/types", function (req, res, next) {
  connection.query("SELECT * FROM testType", (err, result) => {
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
  connection.query(
    `INSERT INTO test SET ?`,
    req.body.testInfo,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      connection.query(
        `INSERT INTO testRange (testId,testRangeSex,rangeFrom,rangeTo,notice) VALUES (?),(?)`,
        [
          [
            result.insertId,
            "male",
            req.body.male.min,
            req.body.male.max,
            req.body.male.notice,
          ],
          [
            result.insertId,
            "female",
            req.body.female.min,
            req.body.female.max,
            req.body.female.notice,
          ],
        ],
        (rangeErr, rangeResult) => {
          if (rangeErr) {
            console.log(rangeErr);
            res.sendStatus(500);
            return;
          }
          res.sendStatus(200);
        },
      );
    },
  );
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
