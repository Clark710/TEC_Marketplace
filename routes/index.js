var express = require('express');
var multer = require('multer');
var router = express.Router();
var pg = require('pg');

var connectionString = "postgres://swen303group7:1234567890@marketplace.cl3zdftaq5q4.ap-southeast-2.rds.amazonaws.com:5432/marketplace"


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

/** Fills the database */
router.get('/add', function(request, response) {
	add();
});

/** Removes everything from the database */
router.get('/remove', function(request, response) {
	remove();
});

function add(){
	pg.connect(connectionString, function(err, client, done){
		// Add item 0
		client.query("INSERT INTO items (id, name, summary, description, price, enddate, userid, stockcount, totalrating, reviewcount) VALUES (0, 'Java DVD', 'Short summary about Java DVD item', 'Longer description about java dvd item', 16.99, '2000-09-09T00:00:00.000Z', 2, 20, 2.3, 3)");
			// Item 0s comments
			client.query("INSERT INTO itemcomments (id, comment, rating, commenterid, itemid) VALUES (0, 'This is the first comment of item 0!', 2, 2, 0)");
			client.query("INSERT INTO itemcomments (id, comment, rating, commenterid, itemid) VALUES (1, 'This is the second comment of item 0!', 4, 3, 0)");
			client.query("INSERT INTO itemcomments (id, comment, rating, commenterid, itemid) VALUES (2, 'This is the third comment of item 0!', 1, 1, 0)");

		// Add item 1
		client.query("INSERT INTO items (id, name, summary, description, price, enddate, userid, stockcount, totalrating, reviewcount) VALUES (1, 'C++ Book', 'Short summary about C++ Book item', 'Longer description about C++ Book item', 9.99, '2000-09-09T00:00:00.000Z', 1, 5, 3, 3)");
			// Item 1s comments
			client.query("INSERT INTO itemcomments (id, comment, rating, commenterid, itemid) VALUES (3, 'This is the first comment of item 1!', 4, 2, 1)");
			client.query("INSERT INTO itemcomments (id, comment, rating, commenterid, itemid) VALUES (4, 'This is the second comment of item 1!', 2, 0, 1)");
			client.query("INSERT INTO itemcomments (id, comment, rating, commenterid, itemid) VALUES (5, 'This is the third comment of item 1!', 3, 3, 1)");

		// Add item 2
		client.query("INSERT INTO items (id, name, summary, description, price, enddate, userid, stockcount, totalrating, reviewcount) VALUES (2, 'AI Tutorial', 'Short summary about AI Tutorial item', 'Longer description about AI Tutorial item', 128.99, '2000-09-09T00:00:00.000Z', 0, -1, 4.5, 2)");
			// Item 2s comments
			client.query("INSERT INTO itemcomments (id, comment, rating, commenterid, itemid) VALUES (6, 'This is the first comment of item 2!', 4, 1, 2)");
			client.query("INSERT INTO itemcomments (id, comment, rating, commenterid, itemid) VALUES (7, 'This is the second comment of item 2!', 5, 0, 2)");


	});
}

function remove(){
	pg.connect(connectionString, function(err, client, done){
		client.query('DELETE FROM itemcomments WHERE id = 0');
		client.query('DELETE FROM itemcomments WHERE id = 1');
		client.query('DELETE FROM itemcomments WHERE id = 2');
		client.query('DELETE FROM itemcomments WHERE id = 3');
		client.query('DELETE FROM itemcomments WHERE id = 4');
		client.query('DELETE FROM itemcomments WHERE id = 5');
		client.query('DELETE FROM itemcomments WHERE id = 6');
		client.query('DELETE FROM itemcomments WHERE id = 7');


		client.query('DELETE FROM items WHERE id = 0');
		client.query('DELETE FROM items WHERE id = 1');
		client.query('DELETE FROM items WHERE id = 2');
	});
}

router.get("/contact",function(req,res) {
    res.render('contact', {title: 'Top End Code'});
});

router.get("/login",function(req,res) {
    res.render('login', {title: 'Top End Code'});
});

router.post('/login', function (req,res,next) {
    console.log("Trying to log in");

    var USERNAME = req.body.user;
    var PASSWORD = req.body.pass;
    console.log(USERNAME + " " + PASSWORD);
    var client = new pg.Client(database);
    pg.connect(database,function(err,client,done){
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        console.log('Connected to database');
        var query = "SELECT * FROM Users WHERE username='%NAME%' AND password='%PASSWORD%';".replace("%NAME%", USERNAME).replace("%PASSWORD%", PASSWORD);
        client.query(query, function(error, result){

            console.log(result);
            console.log(error);
            if(error) {
                console.error('Query failed');
                console.error(error);
                return;
            }
            else if (result.rowCount === 0){
                res.send(false);
                return;
            } else {
                res.send(true);
                console.log("Query success");
                return;
            }
        })
    })
});

router.get("/register",function(req,res) {
    res.render('register', {title: 'Top End Code'});
});

router.get('/search', function(request, response) {
	var search = request.query.search;
	// If no search then display everything
	if(search == undefined){
		var items = [];
		pg.connect(connectionString, function(err, client, done){
			// Query items
			var query = client.query("SELECT * FROM items", function(err, result) {
				// For each item
				for (i = 0; i < result.rows.length; i++) {
					// Add item
					var item = {id:result.rows[i].id, name:result.rows[i].name, summary:result.rows[i].summary, price:result.rows[i].price, rating:result.rows[i].totalrating, reviews:result.rows[i].reviewcount};
					items.push(item);
				}
			});

		  	query.on('end', function(){
				var str = "TEC - " + items.length + " Results";
				response.render('search', {title: str, items: items});
				done();
			});
		});
	} else {
		var items = [];
		pg.connect(connectionString, function(err, client, done){
			// Query items
			var query = client.query("SELECT * FROM items WHERE LOWER(name) LIKE LOWER('%"+search+"%')", function(err, result) {
				// For each item
				for (i = 0; i < result.rows.length; i++) {
					// Add item
					var item = {id:result.rows[i].id, name:result.rows[i].name, summary:result.rows[i].summary, price:result.rows[i].price, rating:result.rows[i].totalrating, reviews:result.rows[i].reviewcount};
					items.push(item);
				}
			});

		  	query.on('end', function(){
				var str = "TEC - " + items.length + " Results from search '" + search + "'";
				response.render('search', {title: str, items: items});
				done();
			});
		});
	}
	
});


/** Browse items page */
router.get('/', function(request, response) {
	var items = [];
	pg.connect(connectionString, function(err, client, done){
		// Query items
		var query = client.query("SELECT * FROM items", function(err, result) {
			// For each item
			for (i = 0; i < result.rows.length; i++) {
				// Add item
				var item = {id:result.rows[i].id, name:result.rows[i].name, summary:result.rows[i].summary, price:result.rows[i].price, rating:result.rows[i].totalrating, reviews:result.rows[i].reviewcount};
				items.push(item);
			}
		});

          	query.on('end', function(){
			response.render('index', {items: items});
			done();
		});
	});
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
	   
	   response.render('view', {id: itemID, name: itemName, description: itemDescription, price: itemPrice, rating: itemRating, reviews: itemReviewCount, stock: itemStock, comments: itemComments, commentRatings: itemCommentRatings, commenterIDs: itemCommenterIDs});
	   done();
          });
	done();
      });
    });
});

module.exports = router;

