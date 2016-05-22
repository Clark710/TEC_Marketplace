var express = require('express');
var multer = require('multer');
var router = express.Router();
var pg = require('pg');
var username = "Login";
var userID = -1;
var loggedIn = 0;
var connectionString = "postgres://swen303group7:1234567890@marketplace.cl3zdftaq5q4.ap-southeast-2.rds.amazonaws.com:5432/marketplace"

 ////// GETS //////

router.get('/', function(request, response) {
	renderHomepage(request, response);
});

router.get('/search', function(request, response) {
	renderSearchpage(request, response);
});

router.get('/view', function(request, response) {
  	var itemID = parseInt(request.query.itemid);
	renderView(itemID, response);
});

router.get("/register",function(req,res) {
	res.render('register', {title: 'Top End Code', username:username, loginState:loggedIn});
});

router.get("/login",function(req,res) {
	res.render('login', {title: 'Top End Code', username:username, loginState:loggedIn});
});

router.get("/logout",function(request,response) {
	username = "Login";
	userID = -1;
	loggedIn = 0;
	renderHomepage(request, response);
});

router.get("/terms",function(req,res) {
  var FNAME = req.body.firstName;
  res.render('terms', {title: 'Top End Code', username: username, loginState:loggedIn});
});

router.get("/contact",function(req,res) {
	res.render('contact', {title: 'Top End Code', username:username, loginState:loggedIn});
});

router.get("/about",function(req,res) {
	res.render('about', {title: 'Top End Code', username:username, loginState:loggedIn});
});

 ////// POSTS //////

router.post("/register",function(req,res){
  var FNAME = req.body.firstName;
  var LNAME = req.body.lastName;
  var UNAME = req.body.username;
  var EMAIL = req.body.email;
  var BIRTHDATE = req.body.birthdate;
  var ADDRESS = req.body.address;
  var PASSWORD = req.body.password;
  console.log(UNAME + " " + PASSWORD);
  var ID = Math.floor((Math.random() * 100) + 1);
  var RATING = 0;
  var client = new pg.Client(connectionString);
  pg.connect(connectionString,function(err,client,done){
    if(err){
      return console.error('Could not connect'.err);
    }
    var query = ("INSERT INTO users (id, email, firstname, lastname, password, birthdate, address, totalrating, username) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)");

    client.query(query,[ID, EMAIL, FNAME, LNAME, PASSWORD, BIRTHDATE, ADDRESS, RATING, UNAME], function(error, result){
      if(error) {
        console.error('Query failed');
        console.error(error);
        return;
      }
      else{
        res.redirect('/');
        return;
      }
    })
  })
});

router.post('/login', function (req,res,next) {
  var USERNAME = req.body.username;
  var PASSWORD = req.body.password;

  var fail = "Failed to login. Please try again.";
  var client = new pg.Client(connectionString);
  pg.connect(connectionString,function(err,client,done){
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    console.log('Connected to database');
    var query = "SELECT * FROM users WHERE username='%NAME%' AND password='%PASSWORD%';".replace("%NAME%", USERNAME).replace("%PASSWORD%", PASSWORD);
    client.query(query, function(error, result){
      if(error) {
        console.error('Query failed');
        console.error(error);
        return;
      }
      else if (result.rowCount === 0){
        res.render('login', { title: 'Top End Code', username: username, failed: fail });
        return;
      } else {
        username = USERNAME;
	userID = result.rows[0].id;
	loggedIn = 1;
	renderHomepage(req, res);
        console.log("Query success");
        return;
      }
    })
  })
});


router.post('/view', function(request, response) {
	pg.connect(connectionString, function(err, client, done){
		var comment = request.body.comment;
		var rating = parseInt(request.body.rating);
		var commenterID = parseInt(request.body.commenterid);
		var itemID = parseInt(request.body.itemid);
  		var ID = Math.floor((Math.random() * 100) + 1);
		if(commenterID < 0){
			// Must be logged in first
			renderView(itemID, response, "You must be logged in before you can comment.");
		} else if(rating < 0 || comment == ""){
			// Must have put a rating and a comment
			renderView(itemID, response, "You must add a rating and a comment");
		} else {
			client.query("INSERT INTO itemcomments (id, comment, rating, commenterid, itemid) VALUES ("+ID+", '"+comment+"', "+rating+", "+userID+", "+itemID+")");
			renderView(itemID, response);
		}
	});
});

 ////// UTILITY //////

/** Test database query selecting all from table items */
router.get('/test_database', function(request, response) {
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log(err);
      return;
    }
    var query = client.query('SELECT * FROM users');
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

 ////// FUNCTIONS //////

function renderHomepage(request, response){
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
			response.render('index', {items: items, username: username, loginState:loggedIn});
			done();
		});
	});
}

function renderView(itemID, response, error){
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

        response.render('view', {userid: userID, id: itemID, name: itemName, description: itemDescription, price: itemPrice, rating: itemRating, reviews: itemReviewCount, stock: itemStock, comments: itemComments, commentRatings: itemCommentRatings, commenterIDs: itemCommenterIDs, username: username, error: error, loginState:loggedIn});
        done();
      });
      done();
    });
  });
}

function renderSearchpage(request, response) {
  var search = request.query.search;
  var category = request.query.type;
  // If no search then display everything
  if(search == undefined){
    if(category == undefined) {
      var items = [];
      pg.connect(connectionString, function (err, client, done) {
        // Query items
        var query = client.query("SELECT * FROM items", function (err, result) {
          // For each item
          for (i = 0; i < result.rows.length; i++) {
            // Add item
            var item = {
              id: result.rows[i].id,
              name: result.rows[i].name,
              summary: result.rows[i].summary,
              price: result.rows[i].price,
              rating: result.rows[i].totalrating,
              reviews: result.rows[i].reviewcount
            };
            items.push(item);
          }
        });

        query.on('end', function () {
          var str = "TEC - " + items.length + " Results";
          response.render('search', {title: str, items: items, username: username, loginState:loggedIn});
          done();
        });
      });
    }
    else {
      var items = [];
      category = "'"+ request.query.type +"'";
      pg.connect(connectionString, function (err, client, done) {
        // Query items
        var query = client.query("SELECT * FROM items WHERE type=" +category, function (err, result) {
          // For each item
          for (i = 0; i < result.rows.length; i++) {
            // Add item
            var item = {
              id: result.rows[i].id,
              name: result.rows[i].name,
              summary: result.rows[i].summary,
              price: result.rows[i].price,
              rating: result.rows[i].totalrating,
              reviews: result.rows[i].reviewcount
            };
            items.push(item);
          }
        });

        query.on('end', function () {
          var str = "TEC - " + items.length + " Results";
          response.render('search', {title: str, items: items, username: username, loginState:loggedIn});
          done();
        });
      });
    }
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
        response.render('search', {title: str, items: items, username: username, loginState:loggedIn});
        done();
      });
    });
  }

}

 ////// OTHER PEOPLES CODE THEY CAN REFORMAT INTO PLACES ABOVE THIS LATER :D //////

/*router.post('/listItem', function(req, res) {
  userid = localStorage.getItem("userid");
  var FILE = req.body.file;
  console.log(FILE);
  var ID = req.body.id;
  var NAME = req.body.name;
  var SUMMARY = req.body.summary;
  var DESCRIPTION = req.body.description;
  var PRICE = req.body.price;
  var ENDDATE = req.body.enddate;
  var USERID = userid;
  var STOCKCOUNT = req.body.stockcount;
  var TYPE = req.body.type;
  var CATEGORY = req.body.category;
  var client = new pg.Client(connectionString);
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }
    console.log('Connected to database');
    var query = ("INSERT INTO items (id, name, summary, description, price, enddate, userid, stockcount, type, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)");
    client.query(query, [ID, NAME, SUMMARY, DESCRIPTION, PRICE, ENDDATE, USERID, STOCKCOUNT, TYPE, CATEGORY], function (error, result) {
      console.log(result);
      console.log(error);
      if (error) {
        console.error('Query failed');
        console.error(error);
        return;
      }
      else {
        res.render('/',{title: 'Top End Code', userid: userid});
        return;
      }
    })
  });
});*/

router.get("/profile",function(req,res) {
  var FNAME = req.body.firstName;
  res.render('profile', {title: 'Top End Code', username: username, loginState:loggedIn});
});

router.get("/listItem",function(req,res) {
  res.render('listItem', {title: 'Top End Code', loginState:loggedIn});
});

router.get("/cart",function(req,res) {
  //    sorry I dont know how to pass parameters yet.
  //    to be implemented 22/05 - mc
  res.render('cart', {title: 'Top End Code', username: username, loginState:loggedIn});
});

module.exports = router;
