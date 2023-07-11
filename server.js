/********************************************************************************* *
 * WEB700 – Assignment 03 *
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source.
 * (including 3rd party web sites) or distributed to other students.
 *  Name: Amit Thakuri Student ID: 141128223 Date: 2023/06/10 *
 * ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const bodyParser = require('body-parser');
var app = express();
const path = require("path");
const collegeData = require("./modules/collegeData");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

collegeData
  .initialize()
  .then(() => {
    app.get("/students", (req, res) => {
      collegeData
        .getAllStudents()
        .then((students) => {
          if (req.query.course) {
            return collegeData.getStudentByCourse(parseInt(req.query.course));
          } else {
            return students;
          }
        })
        .then((result) => {
          if (result.length > 0) {
            res.json(result);
          } else {
            res.json({ message: "no results" });
          }
        })
        .catch(() => {
          res.status(404).json({ message: "no results" });
        });
    });

    app.get("/tas", (req, res) => {
      collegeData
        .getTAs()
        .then((result) => {
          res.json(result);
        })
        .catch(() => {
          res.status(404).json({ message: "no results" });
        });
    });

    app.get("/courses", (req, res) => {
      collegeData
        .getCourses()
        .then((result) => {
          res.json(result);
        })
        .catch(() => {
          res.status(404).json({ message: "no results" });
        });
    });

    app.get("/student/:num", (req, res) => {
      const studentNum = parseInt(req.params.num);
      collegeData
        .getStudentByNum(studentNum)
        .then((result) => {
          res.json(result);
        })
        .catch(() => {
          res.status(404).json({ message: "no results" });
        });
    });

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "home.html"));
    });

    app.get("/about", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "about.html"));
    });

    app.get("/htmlDemo", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
    });

    // new added routes
    app.get("/students/add", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "addStudent.html"));
    });

    
    app.post("/students/add", (req, res) => {
      const studentData = req.body;

    collegeData
        .addStudent(studentData)
        .then(() => {
          res.redirect("/students");
        })

        // don't know if this is necessary so, please remove it if not
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error Adding Student");
        });
    });

    app.use((req, res) => {
      res.status(404).send("Page Not Found");
    });

    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });
