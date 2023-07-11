const myfileSystem = require("fs");

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let myDataCollections = null;

function initialize() {
  return new Promise((resolve, reject) => {
    myfileSystem.readFile(
      "./data/students.json",
      "utf8",
      (err, StudentJson) => {
        if (err) {
          reject("unable to read students.json");
          return;
        }
        myfileSystem.readFile(
          "./data/courses.json",
          "utf8",
          (err, CourseJson) => {
            if (err) {
              reject("unable to read courses.json");
              return;
            }

            const studentData = JSON.parse(StudentJson);
            const courseData = JSON.parse(CourseJson);
            myDataCollections = new Data(studentData, courseData);

            resolve();
          }
        );
      }
    );
  });
}

function getAllStudents() {
  return new Promise((resolve, reject) => {
    if (myDataCollections && myDataCollections.students.length > 0) {
      resolve(myDataCollections.students);
    } else {
      reject("no results returned");
    }
  });
}

function getTAs() {
  return new Promise((resolve, reject) => {
    if (myDataCollections && myDataCollections.students.length > 0) {
      const TAs = myDataCollections.students.filter(
        (student) => student.TA === true
      );
      if (TAs.length > 0) {
        resolve(TAs);
      } else {
        reject("No results returned");
      }
    } else {
      reject("No results returned");
    }
  });
}

function getCourses() {
  return new Promise((resolve, reject) => {
    if (myDataCollections && myDataCollections.courses.length > 0) {
      resolve(myDataCollections.courses);
    } else {
      reject("No results returned");
    }
  });
}

function getStudentByCourse(course) {
  return new Promise((resolve, reject) => {
    if (myDataCollections && myDataCollections.students.length > 0) {
      const sudentsInCourse = myDataCollections.students.filter(
        (student) => student.course === course
      );
      if (sudentsInCourse.length > 0) {
        resolve(sudentsInCourse);
      } else {
        reject("No resluts returned");
      }
    } else {
      reject("No results returned");
    }
  });
}

function getStudentByNum(num) {
  return new Promise((resolve, reject) => {
    if (myDataCollections && myDataCollections.students.length > 0) {
      const student = myDataCollections.students.find(
        (student) => student.studentNum === num
      );
      if (student) {
        resolve(student);
      } else {
        reject("No results returned");
      }
    } else {
      reject("No reuslts returned");
    }
  });
}

function addStudent(studentData) {
  return new Promise((resolve, reject) => {
    if (studentData.TA === undefined) {
      studentData.TA = false;
    } else {
      studentData.TA = true;
    }
    studentData.studentNum = myDataCollections.students.length + 1;

    myDataCollections.students.push(studentData);
    resolve(studentData);
  });
}

module.exports = {
  initialize,
  getAllStudents,
  getTAs,
  getCourses,
  getStudentByCourse,
  getStudentByNum,
  addStudent,
};
