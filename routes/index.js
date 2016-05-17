var express = require('express');
var multer = require('multer');
var router = express.Router();
var pg = require('pg');

var connectionString = "postgres://swen303group7:1234567890@marketplace.cl3zdftaq5q4.ap-southeast-2.rds.amazonaws.com:5432/marketplace"

router.get("/",function(req,res) {
    res.render('index', {title: 'Top End Code'});
});

router.get('/test_database', function(request, response) {
    pg.connect(connectionString, function(err, client, done){
    if(err){
        done();
        console.log(err);
        return;
    }
    var query = client.query('SELECT * FROM items');
    var rows = [];
    query.on('row', function(row){
        rows.push(row);
    });
    query.on('end', function(){
        response.json(rows);
        done();
        return;
    });
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

