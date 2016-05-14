var express = require('express');
var multer = require('multer');
var router = express.Router();
var pg = require('pg').native;
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'marketplace.cl3zdftaq5q4.ap-southeast-2.rds.amazonaws.com',
  user     : 'swen303group7',
  password : '1234567890',
  port     : '5432'
});


// Original connection method. Date:  21:21 12/05/2016 
//
//var connectionString = "postgres://copleyquen:123@depot:5432/marketplace_group_7"
//var client = new pg.Client(connectionString);
//client.connect();

//connection.connect();
// to implement method below.
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});

//connection.end();

var cheerio = require('cheerio');
router.get("/",function(req,res) {
    res.render('index', {title: 'Top End Code'});
});

router.get('/test_database', function(request, response) {
    var query = client.query("SELECT * FROM items");
    query.on('error', function () {
        response.status(404).send({message: "fail to complete item"});
    });
    var results = [];
    // Stream results back one row at a time 
    query.on('row', function (row) {
        results.push(row);
    });

    // After all data is returned, close connection and return results 
    query.on('end', function () {
        response.json(results);
    });
});


router.get("/browse",function(req,res) {

  res.render('browse', {title: 'Top End Code'});

});

router.post('/upload', function(req, res){
});

router.get('/search1', function(req, res) {
});

router.get('/view', function(req, res) {
});

router.get('/download', function(req, res) {
});

router.post("/submit",function(req,res){
});

router.get('/edit', function(req,res) {
});


module.exports = router;

