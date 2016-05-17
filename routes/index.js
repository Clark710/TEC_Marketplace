var express = require('express');
var multer = require('multer');
var router = express.Router();
var pg = require('pg');

var connectionString = "postgres://swen303group7:1234567890@marketplace.cl3zdftaq5q4.ap-southeast-2.rds.amazonaws.com:5432/marketplace"

/** Get index page aka The front page */
router.get("/",function(req,res) {
    res.render('index', {title: 'Top End Code'});
});

/** Get contact page where people can find ways to contact TEC */
router.get("/contact",function(req,res) {
    res.render('contact', {title: 'Top End Code'});
});

/** Test database query selecting all from table items */
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

/** Test database query selecting all from table items */
router.get('/check', function(request, response) {
    pg.connect(connectionString, function(err, client, done){
      if(err){
	  done();
	  console.log(err);
	  return;
      }
      var query = client.query('SELECT * FROM itemcomments');
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

router.get('/add', function(request, response) {
    pg.connect(connectionString, function(err, client, done){
      client.query("INSERT INTO itemcomments (id, comment, rating, commenterid, itemid) VALUES (0, 'This is the first comment of item 1084!', 4, 404, 1084)");
      client.query("INSERT INTO itemcomments (id, comment, rating, commenterid, itemid) VALUES (1, 'This is the second comment of item 1084!', 1, 405, 1084)");
      client.query("INSERT INTO itemcomments (id, comment, rating, commenterid, itemid) VALUES (2, 'This is the third comment of item 1084!', 2, 406, 1084)");
    });
});

router.get('/remove', function(request, response) {
    pg.connect(connectionString, function(err, client, done){
      client.query('DELETE FROM itemcomments WHERE id = 0');
      client.query('DELETE FROM itemcomments WHERE id = 1');
      client.query('DELETE FROM itemcomments WHERE id = 2');
    });
});


router.get("/browse",function(req,res) {
  
  res.render('browse', {title: 'Top End Code'});
  
  
});

router.post('/upload', function(req, res){
});

router.get('/search1', function(req, res) {
});

/** View a specific items page */
router.get('/view', function(request, response) {
  var itemID = parseInt(request.query.itemid);
  
    pg.connect(connectionString, function(err, client, done){
      // Check for error in connection
      if(err){
	  done();
	  console.log(err);
	  return;
      }
      
      // First query
      var query = client.query("SELECT * FROM items WHERE id = " + itemID);
      var rows = [];
      var itemName;
      var itemDescription;
      var itemPrice;
      var itemStock;
      var itemRating;
      
      // Put all the items into the array
      query.on('row', function(row){
	  rows.push(row);
      });
      
      // Act on items
      query.on('end', function(){
	
	  if(rows.length != 1){
	      console.log("ERROR WITH ITEM: " + rows.length);
	      done();
	      return;
	  }
	
          itemID = rows[0].id;
	  itemName = rows[0].name;
	  itemDescription = rows[0].description;
	  itemPrice = rows[0].price;
          itemStock = rows[0].stockcount;
	  //itemRating = rows[0].totalrating;
	  
	  // Second query
	  var query2 = client.query("SELECT * FROM itemcomments WHERE itemid = " + itemID);
	  var rows2 = [];
	  var itemReviewCount;
	  
	  // Put all the items into the array
	  query2.on('row', function(row){
	      rows2.push(row);
	  });
	  
	  // Act on item comments and ratings. Render the page
          query2.on('end', function(){
	    var itemReviewCount = rows2.length;
	    var itemRating = 0;
	    var itemComments = [];
	    var itemCommentRatings = [];
	    var itemCommenterIDs = [];
	    
	    // Get item overall rating, each comment and its relative rating
	    if(itemReviewCount > 0){
	      var index = 0;
	      var itemCom = rows2[index];
	      while(itemCom!=null){
		itemRating += itemCom.rating;
		itemComments[index] = itemCom.comment;
		itemCommentRatings[index] = itemCom.rating;
		itemCommenterIDs[index] = itemCom.commenterid;
		itemCom = rows2[++index];
	      }
	      itemRating = itemRating/itemReviewCount;
	    }
	   
	   response.render('view', {name: itemName, description: itemDescription, price: itemPrice, rating: itemRating, reviews: itemReviewCount, stock: itemStock, comments: itemComments, commentRatings: itemCommentRatings, commenterIDs: itemCommenterIDs});
	   done();
          });
      });
    });
});

router.get('/download', function(req, res) {
});

router.post("/submit",function(req,res){
});

router.get('/edit', function(req,res) {
});

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}


module.exports = router;

