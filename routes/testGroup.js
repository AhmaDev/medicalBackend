var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var db = require("../config/database");
var connection = mysql.createConnection(db);

router.get("/:id", function (req, res, next) {
  connection.query(
    "SELECT * FROM testGroup WHERE idTestGroup = ?",
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

router.get("/", function (req, res, next) {
  connection.query(
    "SELECT *, IFNULL((SELECT JSON_ARRAYAGG(json_object('idTest',idTest,'testName',testName,'testTypeId',testTypeId,'unit',unit,'price',price,'male',IFNULL((SELECT json_object('testId',testId,'rangeFrom',rangeFrom,'rangeTo',rangeTo,'notice',notice) FROM testRange WHERE testRange.testId = test.idTest AND testRange.testRangeSex = 'male' LIMIT 1),'[]'),'female', IFNULL((SELECT json_object('testId',testId,'rangeFrom',rangeFrom,'rangeTo',rangeTo,'notice',notice) FROM testRange WHERE testRange.testId = test.idTest AND testRange.testRangeSex = 'female' LIMIT 1),'[]'))) FROM test WHERE testGroup.idTestGroup = test.testGroupId),'[]') As tests FROM testGroup",
    (err, result) => {
      if (result.length > 0) {
        result = result.map((row) => {
          var rows = (row.tests = JSON.parse(row.tests));
          rows = rows.map(
            (maleRow) => ((maleRow.male = JSON.parse(maleRow.male)), maleRow),
          );
          rows = rows.map(
            (femaleRow) => (
              (femaleRow.female = JSON.parse(femaleRow.female)), femaleRow
            ),
          );
          return rows, row;
        });

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
  connection.query(`INSERT INTO testGroup SET ?`, req.body, (err, result) => {
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
    `UPDATE testGroup SET ? WHERE idTestGroup = ${req.params["id"]}`,
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
    `DELETE FROM testGroup WHERE idTestGroup = ${req.params["id"]}`,
    (err, result) => {
      res.send(result);
      if (err) {
        console.log(err);
      }
    },
  );
});

module.exports = router;
