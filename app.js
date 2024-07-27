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
    console.log(result);
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
    res.send("Table not found");
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

app.put("/:tableName", async function(req,res){
  const tableName=req.params.tableName;
  const columnName=req.body.column;
  try{
   await sql.query(`ALTER TABLE ${tableName} ADD ${columnName} VARCHAR(100)`);
   res.send("Column Added");
  }
  catch(err){
    console.log(err);
    res.send("Column not added");
  }
});

app.patch("/",async function(req,res){
  const std_id=req.body.student_id;
  const std_Address=req.body.address;
  try{
    await sql.query(`UPDATE student SET address = '${std_Address}' WHERE student_id = ${std_id}`);
    res.send("Updated Successfully");
  }
  catch(err){
    res.send("Field not updated");
    console.log(err);
  }
});

app.delete("/:tableName", async function(req,res){
  const tableName=req.params.tableName;
  const columnName=req.body.column;
  try{
  await sql.query(`ALTER TABLE ${tableName} DROP COLUMN ${columnName}`);
  res.send("Column Deleted");
}
catch(err){
  res.send("Error ,Field not deleted");
}
});

app.listen(3000, function (req, res) {
  console.log("Server is running on port 3000");
});