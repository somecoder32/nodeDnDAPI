let http = require('http'),
	express = require('express'),
	assert = require('assert'),
	MongoClient = require('mongodb').MongoClient,
	path = require('path'),
	bodyParser = require('body-parser');
	var fs = require("fs");

var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
console.log(settings[0].view);
var app = express();
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var data;
app.set('port', process.env.PORT || 8081);

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

const editURL = settings[0].view;
const viewURL = settings[1].edit;
//var localURL = 'mongodb://localhost:27017/';

app.get('/testhbs',function(req,res){
	res.render('index');	
});

app.get('/characters', function (req, res) {
		console.log('request received for ' + req.query.Name);

		try{
		MongoClient.connect(viewURL, function (err, db) {
			if (!err) {
				console.log(req.query.Name);

				var collection = db.collection("characters");
				if(req.query.Name)
				{					
					collection.find({'CharName': req.query.Name }).toArray(function (err, docs) {
					data = JSON.stringify(docs);
					
					res.render('index',docs[0]);
				});		
				}
				else{
					collection.find(req.query).toArray(function (err, docs) {
						data = JSON.stringify(docs);
						//callback(docs);
						//console.log(data);
						res.end(data);
					});		
				}	

			}
			else {
				console.log(err);
			}
		});
	}
	catch(e){
		console.log(e);
	}

	});

app.post('/characters', function(req, res){
	console.log('Will insert ' + JSON.stringify(req.body.character[0]));

	const data = {"message":"Success"};
	
	MongoClient.connect(editURL, function (err, db) {
		if (!err) {			

			var collection = db.collection("characters");

				collection.insertOne(req.body.character[0],function(err, result) {  
					assert.equal(err,null); 			
					console.log("Inserted a document into the restaurants collection.");
					db.close();
				});			

			console.log("Character " + req.body.character + " saved");
		}
		else {
			console.log(JSON.stringify(err));
		}
	});
	res.end(JSON.stringify(data));
});

app.get('/spells/:class/:level/:html', function (req, res) {
	MongoClient.connect(viewURL, function (err, db) {
		if (!err) {
			console.log("We are connected");

			var collection = db.collection("spells");
			var lvl = parseInt(req.params.level);			
			var spellList = {spells: []};
						
			if (req.params.class === "wiz") {
				collection.find({ wiz: lvl }, { name: 1, _id:0}).toArray(function (err, docs) {					
					if(req.params.html==="1"){
						spellList.spells = docs.sort((a,b) => (a.name > b.name) ? 1 : -1);
						res.render('spells',spellList);
					} else {
						res.end(JSON.stringify(docs));
					}
				});
			}
			else if (req.params.class === "bard") {
				collection.find({ bard: lvl }, { name: 1, _id:0 }).toArray(function (err, docs) {
					res.end(JSON.stringify(docs));
				});
			}
			else if (req.params.class === "cleric") {
				collection.find({ cleric: lvl }, { name: 1, _id:0 }).toArray(function (err, docs) {
					res.end(JSON.stringify(docs));
				});
			}
			else if (req.params.class === "sor") {
				collection.find({ sor: lvl }, { name: 1, _id:0 }).toArray(function (err, docs) {
					res.end(JSON.stringify(docs));
				});
			}
			else if (req.params.class === "ranger") {
				collection.find({ ranger: lvl }, { name: 1, _id:0 }).toArray(function (err, docs) {
					res.end(JSON.stringify(docs));
				});
			}

		}
	});
});


	app.get('/spell/:Name/:html', function (req, res) {
		console.log('request received');
		MongoClient.connect(viewURL, function (err, db) {
			if (!err) {
				var collection = db.collection("spells");

				collection.find({ "name": req.params.Name }, { name: 1, description: 1, _id: 0 }).toArray(function (err, docs) {
					data = JSON.stringify(docs);
					//callback(docs);
					//console.log(data);
					
					if(req.params.html === "1"){
						res.render('spelldetail',docs[0]);
					}
					else {
						res.end(data);
					}
					
				});			

			}
		});

	});

	// app.get('/:Name', function (req, res) {
	// 	console.log('request received');
	// 	MongoClient.connect("mongodb://localhost:27017/monsters", function (err, db) {
	// 		if (!err) {
	// 			console.log(req.params.Name);

	// 			var collection = db.collection("monsters");

	// 			collection.find({ "Name": req.params.Name }, { Name: 1, CR: 1, _id: 0 }).toArray(function (err, docs) {
	// 				data = JSON.stringify(docs);
	// 				//callback(docs);
	// 				//console.log(data);
	// 				res.end(data);
	// 			});			

	// 		}
	// 	});

	// });


	http.createServer(app).listen(app.get('port'), function () {
		console.log('Express server listening on port ' + app.get('port'));
	});

	// function getCharacters() {

	// 	MongoClient.connect(liveURL + "/characters", function (err, db) {
	// 		if (!err) {
	// 			console.log("We are connected");

	// 			var collection = db.collection("characters");
	// 			collection.find({}).toArray(function (err, docs) {
	// 				//assert.equal(err, null);
	// 				//assert.equal(2, docs.length);
	// 				console.log("Found the following records");
	// 				//console.dir(docs)
	// 				data = JSON.stringify(docs);
	// 				//callback(docs);
	// 			});

	// 		}
	// 		else {
	// 			console.log(JSON.stringify(err));
	// 		}
	// 	});
	// }