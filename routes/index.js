var express = require('express');
var multer = require('multer');
var router = express.Router();
var pg = require('pg').native;
console.log("Printing from app.js")

var connectionString = "postgres://copleyquen:123@depot:5432/marketplace_group_7"
var client = new pg.Client(connectionString);
client.connect();
console.log("Printing from app.js")


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

