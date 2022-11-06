var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var db = require("../config/database");
var connection = mysql.createConnection(db);

/* GET users listing. */
router.get("/", function (req, res, next) {
  connection.query("SELECT * FROM patientTest", (err, result) => {
    res.send(result);
    if (err) {
      console.log(err);
    }
  });
});

router.get("/:id", function (req, res, next) {
  connection.query(
    "SELECT *, DATE_FORMAT(createdAt, '%Y-%m-%d') As creationFixedDate, DATE_FORMAT(createdAt, '%T') As creationFixedTime, DATE_FORMAT(createdAt, '%W') As creationDayName FROM patientTest WHERE idPatientTest = ?",
    [req.params["id"]],
    (err, result) => {
      if (result.length > 0) {
        connection.query(
          `SELECT * FROM patientTestContent WHERE patientTestId = ${req.params.id}`,
          (contentErr, contentResult) => {
            result[0].content = contentResult;
            res.send(result[0]);
          },
        );
      } else {
        res.sendStatus(404);
      }
      if (err) {
        console.log(err);
      }
    },
  );
});

router.get("/patient/:id", function (req, res, next) {
  connection.query(
    "SELECT *, DATE_FORMAT(createdAt, '%Y-%m-%d') As creationFixedDate, DATE_FORMAT(createdAt, '%T') As creationFixedTime, DATE_FORMAT(createdAt, '%W') As creationDayName FROM patientTest WHERE patientId = ?",
    [req.params["id"]],
    (err, result) => {
      if (result.length > 0) {
        res.send(result);
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
  connection.query(
    `INSERT INTO patientTest SET ?`,
    req.body.patientTest,
    (err, result) => {
      if (err) {
        res.sendStatus(500);
        console.log(err);
        return;
      }

      contents = req.body.patientTestContents.map((e) => [
        result.insertId,
        e.testId,
        parseFloat(e.amount),
      ]);
      connection.query(
        `INSERT INTO patientTestContent (patientTestId,testId,amount) VALUES ?`,
        [contents],
        (contentsErr, contentsResult) => {
          if (contentsErr) {
            console.log(contentsErr);
            res.sendStatus(500);
            return;
          }
        },
      );

      res.sendStatus(200);
    },
  );
});

/* EDIT USER */
router.put("/edit/:id", function (req, res, next) {
  console.log(req.body);
  connection.query(
    `UPDATE patientTest SET ? WHERE idPatientTest = ${req.params["id"]}`,
    [req.body],
    (err, result) => {
      res.send(result);
      if (err) {
        console.log(err);
      }
    },
  );
});

router.put("/content/edit/:id", function (req, res, next) {
  console.log(req.body);
  connection.query(
    `UPDATE patientTestContent SET ? WHERE idPatientTestContent = ${req.params["id"]}`,
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
    `DELETE FROM patientTest WHERE idPatientTest = ${req.params["id"]}`,
    (err, result) => {
      res.send(result);
      if (err) {
        console.log(err);
      }
    },
  );
});

module.exports = router;
