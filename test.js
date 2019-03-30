// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
function getCharacters(){
MongoClient.connect("mongodb://localhost:27017/characters", function(err, db) {
  if(!err) {
    console.log("We are connected");
	
	var collection = db.collection("characters");
	 collection.find({}).toArray(function(err, docs) {
    //assert.equal(err, null);
    //assert.equal(2, docs.length);
    console.log("Found the following records");
    console.dir(docs)
    //callback(docs);
  });    
	
  }
});
}