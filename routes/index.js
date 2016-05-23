var express = require('express');
var multer = require('multer');
var router = express.Router();
var pg = require('pg');
var username = "Login";
var userID = -1;
var loggedIn = 0;
var user;
var cartItems = [];

////// FAKE CART ITEMS //////
/*var item1 = {
	id: 0,
	name: "fake1",
	price: 19.99,  
	summary: "De scriptio ndescr ipt ion descript. Iondesc ript iondescr iptiondescrip tiondescripti. Ondes criptiondescriptiondescri tiondescriptio ndescri ptiondes cription. De scriptio ndescr ipt ion descript. Iondesc ript iondescr iptiondescrip tiondescripti. Ondes criptiondescriptiondescri tiondescriptio ndescri ptiondes cription."
};
var item2 = {
	id: 1,
	name: "fake2",
	price: 29.99,  
	summary: "De scriptio ndescr ipt ion descript. Iondesc ript iondescr iptiondescrip tiondescripti. Ondes criptiondescriptiondescri tiondescriptio ndescri ptiondes cription. De scriptio ndescr ipt ion descript. Iondesc ript iondescr iptiondescrip tiondescripti. Ondes criptiondescriptiondescri tiondescriptio ndescri ptiondes cription."
};
var item3 = {
	id: 2,
	name: "fake3",
	price: 39.99,  
	summary: "De scriptio ndescr ipt ion descript. Iondesc ript iondescr iptiondescrip tiondescripti. Ondes criptiondescriptiondescri tiondescriptio ndescri ptiondes cription. De scriptio ndescr ipt ion descript. Iondesc ript iondescr iptiondescrip tiondescripti. Ondes criptiondescriptiondescri tiondescriptio ndescri ptiondes cription."
};
var item4 = {
	id: 3,
	name: "fake4",
	price: 49.99,  
	summary: "De scriptio ndescr ipt ion descript. Iondesc ript iondescr iptiondescrip tiondescripti. Ondes criptiondescriptiondescri tiondescriptio ndescri ptiondes cription. De scriptio ndescr ipt ion descript. Iondesc ript iondescr iptiondescrip tiondescripti. Ondes criptiondescriptiondescri tiondescriptio ndescri ptiondes cription."
};
cartItems[0] = item1;
cartItems[1] = item2;
cartItems[2] = item3;
cartItems[3] = item4;*/
////// FAKE CART ITEMS //////

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
	res.render('register', {title: 'Top End Code', username:username, userid:userID, loginState:loggedIn, cartCount:cartItems.length});
});

router.get("/login",function(req,res) {
	res.render('login', {title: 'Top End Code', username:username, userid:userID, loginState:loggedIn, cartCount:cartItems.length});
});

router.get("/profile",function(request,response) {
  	var profileID = parseInt(request.query.userid);
	renderProfile(profileID, response);
});

router.get("/logout",function(request,response) {
	username = "Login";
	userID = -1;
	loggedIn = 0;
	renderHomepage(request, response);
});

router.get("/cart",function(request, response) {
	renderCart(request,response);
});

router.get("/terms",function(req,res) {
  res.render('terms', {title: 'Top End Code', username: username, userid:userID, loginState:loggedIn, cartCount:cartItems.length});
});

router.get("/contact",function(req,res) {
	res.render('contact', {title: 'Top End Code', username:username, userid:userID, loginState:loggedIn, cartCount:cartItems.length});
});

router.get("/about",function(req,res) {
	res.render('about', {title: 'Top End Code', username:username, userid:userID, loginState:loggedIn, cartCount:cartItems.length});
});

router.get("/listItem",function(req,res) {
  res.render('listItem', {title: 'Top End Code', username:username, userid:userID, loginState:loggedIn, cartCount:cartItems.length});
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
        res.render('login', { title: 'Top End Code', username: username, userid:userID, failed: fail });
        return;
      } else {
        username = USERNAME;
	userID = result.rows[0].userid;
	var firstname = result.rows[0].firstname;
	var lastname = result.rows[0].lastname;
	var address = result.rows[0].address;
	var email = result.rows[0].email;
	user = {id:userID, fname:firstname, lname:lastname, address:address, email:email}
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
		if(request.body.rating==undefined){
			var rating = undefined;
		} else {
			var rating = parseInt(request.body.rating);
		}
		var commenterID = parseInt(request.body.commenterid);
		var itemID = parseInt(request.body.itemid);
  		var ID = Math.floor((Math.random() * 100) + 1);
		if(commenterID < 0){
			// Must be logged in first
			renderView(itemID, response, "You must be logged in before you can comment.");
		} else if(rating < 0 || rating == undefined || comment == "" || comment == undefined){
			// Must have put a rating and a comment
			renderView(itemID, response, "You must add a rating and a comment");
		} else {
			console.log("ID: " + ID + ", COMMENT: " + comment + ", Rating: " + rating + ", UserID: " + userID + ", itemID: " + itemID);
			client.query("INSERT INTO itemcomments (id, comment, rating, commenterid, itemid) VALUES ("+ID+", '"+comment+"', "+rating+", "+userID+", "+itemID+")");
			renderView(itemID, response);
		}
	});
});

router.post('/listItem', function(req, res) {
	var USERID = parseInt(req.body.userid);
	var NAME = req.body.name;
	var SUMMARY = req.body.summary;
	var DESCRIPTION = req.body.description;
	var PRICE = parseFloat(req.body.price);
	var ENDDATE = req.body.enddate;
	var STOCKCOUNT = parseInt(req.body.stockcount);
	var TYPE = req.body.type;
	var CATEGORY = req.body.category;
	if(USERID != -1){
		pg.connect(connectionString, function (err, client, done) {
			client.query("INSERT INTO items (name, summary, description, price, enddate, userid, stockcount, totalrating, reviewcount, type, catagory) VALUES ('"+NAME+"', '"+SUMMARY+"', '"+DESCRIPTION+"', "+PRICE+", '"+ENDDATE+"', "+USERID+", "+STOCKCOUNT+", "+0+", "+0+", '"+TYPE+"', '"+CATEGORY+"')");
		});
	}
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

 ////// FUNCTIONS //////

function renderHomepage(request, response){
	var items = [];
	pg.connect(connectionString, function(err, client, done){
		// Query items
		var query = client.query("SELECT * FROM items ORDER BY itemid LIMIT 6", function(err, result) {
			// For each item
			for (i = 0; i < result.rows.length; i++) {
				// Add item
				var item = {id:parseInt(result.rows[i].itemid), name:result.rows[i].name, summary:result.rows[i].summary, price:parseFloat(result.rows[i].price), rating:parseInt(result.rows[i].totalrating), reviews:parseInt(result.rows[i].reviewcount)};
				items.push(item);
			}
		});

		query.on('end', function(){
			console.log(items[0].reviews);
			response.render('index', {items: items, username: username, userid:userID, loginState:loggedIn, cartCount:cartItems.length});
			done();
		});
	});
}

function renderProfile(profileID, response){
	pg.connect(connectionString,function(err,client,done){
		client.query("SELECT * FROM users WHERE userid="+profileID+";", function(error, result){
			if(result != undefined){
				var firstname = result.rows[0].firstname;
				var lastname = result.rows[0].lastname;
				var address = result.rows[0].address;
				var email = result.rows[0].email;
				var profileUsername = result.rows[0].username;
				user = {id:profileID, fname:firstname, lname:lastname, address:address, email:email, username: profileUsername}
				response.render('profile', {title: 'Top End Code', username: username, userid:userID, user: user, loginState:loggedIn, cartCount:cartItems.length});
			} else {
				var firstname = "";
				var lastname = "";
				var address = "";
				var email = "";
				var profileUsername = "";
				user = {id: "", fname:firstname, lname:lastname, address:address, email:email, username: profileUsername}
				response.render('profile', {title: 'Top End Code', username: username, userid:userID, user: user, loginState:loggedIn, cartCount:cartItems.length});
			}
		});
	});
}

function renderCart(request, response){
	if(request.query.itemid != undefined && loggedIn == 1){
		pg.connect(connectionString, function(err, client, done){
			var itemID = parseInt(request.query.itemid);
			// Query items
			var query = client.query("SELECT * FROM items WHERE itemid = " + itemID + " ORDER BY itemid;", function(err, result) {
				// Add item to list
				var item = {id:parseInt(result.rows[0].itemid), name:result.rows[0].name, description:result.rows[0].summary, price:parseFloat(result.rows[0].price), rating:parseInt(result.rows[0].totalrating)};
				cartItems.push(item);
				console.log(cartItems.length);
			});

			query.on('end', function(){
				// Compute carts total price 
				var cartPrice = 0;
				for( i = 0 ; i < cartItems.length ; i++){
					cartPrice += cartItems[i].price;
				}
				// Carts title
				var str = cartItems.length + " items in your cart";
				response.render('cart', {title: str, items: cartItems, username: username, userid:userID, loginState:loggedIn, totalPrice: cartPrice, cartCount:cartItems.length});
				done();
			});

		});
		return;
	}

	if(request.query.index != undefined && loggedIn == 1){
		cartItems.splice(request.query.index, 1);
	}
	
	// Compute carts total price 
	var cartPrice = 0;
	for( i = 0 ; i < cartItems.length ; i++){
		cartPrice += cartItems[i].price;
	}
	// Carts title
	var str = cartItems.length + " items in your cart";
	response.render('cart', {title: str, items: cartItems, username: username, userid:userID, loginState:loggedIn, totalPrice: cartPrice, cartCount:cartItems.length});
	
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
    var query = client.query("SELECT * FROM items WHERE itemid = " + itemID);
    var rows = [];
    var itemName;
    var itemDescription;
    var itemPrice;
    var itemStock;
    var itemRating;
    var listerID;

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

      itemID = rows[0].itemid;
      itemName = rows[0].name;
      itemDescription = rows[0].description;
      itemPrice = parseFloat(rows[0].price);
      itemStock = rows[0].stockcount;
      listerID = rows[0].userid;
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
          client.query("UPDATE items SET reviewcount="+itemReviewCount+" WHERE itemid="+itemID+";");
          client.query("UPDATE items SET totalrating="+itemRating+" WHERE itemid="+itemID+";");
        }

        response.render('view', {userid: userID, id: itemID, listerid: listerID, name: itemName, description: itemDescription, price: itemPrice, rating: itemRating, reviews: itemReviewCount, stock: itemStock, comments: itemComments, commentRatings: itemCommentRatings, commenterIDs: itemCommenterIDs, username: username, userid:userID, error: error, loginState:loggedIn, cartCount:cartItems.length});
        done();
      });
      done();
    });
  });
}

function renderSearchpage(request, response) {
  var search = request.query.search;
  var catagory = request.query.catagory;
  console.log(catagory);
  var type = request.query.type;
  var itemStart;
  if (request.query.itemStart == undefined){
    itemStart = 0;
  } else {
    itemStart = parseInt(request.query.itemStart);
    if (itemStart < 0){
      itemStart = 0;
    }
  }
  // If no search then display everything
  if(search == undefined){
    if(type == undefined && catagory == undefined) {
      var items = [];
      pg.connect(connectionString, function (err, client, done) {
        // Query items
        var query = client.query("SELECT * FROM items;", function (err, resultTotal) {
		var query = client.query("SELECT * FROM items ORDER BY itemid LIMIT 10 OFFSET "+itemStart+";", function (err, result) {
		  // For each item
		  for (i = 0; i < result.rows.length; i++) {
		    // Add item
		    var item = {
		      id: result.rows[i].itemid,
		      name: result.rows[i].name,
		      summary: result.rows[i].summary,
		      price: parseFloat(result.rows[i].price),
		      rating: result.rows[i].totalrating,
		      reviews: result.rows[i].reviewcount
		    };
		    items.push(item);
		  }
		});

		query.on('end', function () {
		  var str = "TEC - " + resultTotal.rows.length + " Results";
		  response.render('search', {title: str, items: items, username: username, userid:userID, itemStart: itemStart, loginState:loggedIn, cartCount:cartItems.length});
		  done();
		});
	});
      });
    }
    else if (type == undefined) {
      var items = [];
      pg.connect(connectionString, function (err, client, done) {
        // Query items
        var query = client.query("SELECT * FROM items WHERE catagory='" + catagory + "';", function (err, resultTotal) {
		var query = client.query("SELECT * FROM items WHERE catagory='" + catagory + "' ORDER BY itemid LIMIT 10 OFFSET "+itemStart+";", function (err, result) {
		  // For each item
		  for (i = 0; i < result.rows.length; i++) {
		    // Add item
		    var item = {
		      id: result.rows[i].itemid,
		      name: result.rows[i].name,
		      summary: result.rows[i].summary,
		      price: parseFloat(result.rows[i].price),
		      rating: result.rows[i].totalrating,
		      reviews: result.rows[i].reviewcount
		    };
		    items.push(item);
		  }
		});

		query.on('end', function () {
		  var str = "TEC - " + resultTotal.rows.length + " Results";
		  response.render('search', {title: str, items: items, username: username, userid:userID, catagory: catagory, itemStart: itemStart, loginState:loggedIn, cartCount:cartItems.length});
		  done();
		});
        });
      });
    }
    else{
      var items = [];
      pg.connect(connectionString, function (err, client, done) {
        // Query items
        var query = client.query("SELECT * FROM items WHERE type='" + type + "';", function (err, resultTotal) {
		var query = client.query("SELECT * FROM items WHERE type='" + type + "' ORDER BY itemid LIMIT 10 OFFSET "+itemStart+";", function (err, result) {
		  // For each item
		  for (i = 0; i < result.rows.length; i++) {
		    // Add item
		    var item = {
		      id: result.rows[i].itemid,
		      name: result.rows[i].name,
		      summary: result.rows[i].summary,
		      price: parseFloat(result.rows[i].price),
		      rating: result.rows[i].totalrating,
		      reviews: result.rows[i].reviewcount
		    };
		    items.push(item);
		  }
		});

		query.on('end', function () {
		  var str = "TEC - " + resultTotal.rows.length + " Results";
		  response.render('search', {title: str, items: items, username: username, userid:userID, type: type, itemStart: itemStart, loginState:loggedIn, cartCount:cartItems.length});
		  done();
		});
	});
      });
    }
  } else {
    var items = [];
    pg.connect(connectionString, function(err, client, done){
      // Query items
      var query = client.query("SELECT * FROM items WHERE LOWER(name) LIKE LOWER('%"+search+"%');", function (err, resultTotal) {
	      var query = client.query("SELECT * FROM items WHERE LOWER(name) LIKE LOWER('%"+search+"%')" + " ORDER BY itemid LIMIT 10 OFFSET "+itemStart+";", function(err, result) {
		// For each item
		for (i = 0; i < result.rows.length; i++) {
		  // Add item
		  var item = {id:result.rows[i].itemid, name:result.rows[i].name, summary:result.rows[i].summary, price:parseFloat(result.rows[i].price), rating:result.rows[i].totalrating, reviews:result.rows[i].reviewcount};
		  items.push(item);
		}
	      });

	      query.on('end', function(){
		var str = "TEC - " + items.length + " Results from search '" + search + "'";
		response.render('search', {title: str, items: items, username: username, userid:userID, itemStart: itemStart, loginState:loggedIn, cartCount:cartItems.length});
		done();
	      });
      });
    });
  }
}


module.exports = router;
