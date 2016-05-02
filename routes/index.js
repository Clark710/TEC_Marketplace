var express = require('express');
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
var router = express.Router();

var fs = require('fs');

const TEI = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';";

//var pageContents = new Set([iterable]);

client.execute("OPEN Colenso");
//client.execute("ADD C:\Users\The Beast\swen303-project1\colensoWebsite\Colenso_TEIs\Dylan\private_letters\DYLAN FILE.xml");

router.get("/",function(req,res){
	client.execute(TEI + "//index",
		function (error, result) {
			if(error){ 
				console.error(error);
			} else {
				res.render('index', { title: 'Index Page', place : 'Wellington'});
			}
		}
	);
});

module.exports = router;
