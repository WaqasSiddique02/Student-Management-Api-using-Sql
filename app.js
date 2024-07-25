const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

var config = {
  user:'waqas',
  password:'Waqas@1234',
  server: 'localhost',
  database: 'stdManagement',
  port: 1433,
  options: {
    trustedConnection: true,
    encrypt: false
  }
};

sql.connect(config, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to database");
  }
});

app.get("/", async function (req, res) {
  try {
    const result = await sql.query("SELECT student_id,student_name FROM student");
    console.log(result.recordset);
    res.send(result.recordset);
    }
  catch(err){
  console.log(err);
}
});

app.get("/:tableName", async function(req,res){
  const tableName=req.params.tableName;
  try{
    const result=await sql.query(`SELECT * FROM ${tableName}`);
    res.send(result.recordset);
  }
  catch(err){
    console.log(err);
  }
});

app.post("/", async function (req, res) {
  const std_id=req.body.student_id;
  const std_name=req.body.student_name;
  const std_age=req.body.age;
  const class_id=req.body.class_id;
  const school_id=req.body.school_id;

  if(!std_id || !std_name || !std_age || !class_id || !school_id){
    res.send("Please fill all the fields");
  };

  try {
    await sql.query`INSERT INTO student (student_id, student_name, age, class_id, school_id)VALUES (${std_id}, ${std_name}, ${std_age}, ${class_id}, ${school_id})`;
    res.send("Inserted Successfully");
  }
  catch(err){
    console.log(err);
  }
   
});

app.listen(3000, function (req, res) {
  console.log("Server is running on port 3000");
});