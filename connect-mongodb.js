//import mongo db connector/driver
var MongoClient = require('mongodb').MongoClient
var Promise = require('promise');

console.log("mongodb object  " + MongoClient)
console.log("Promise " + JSON.stringify(Promise))

//connect to mongodb through driver
MongoClient.connect("mongodb://localhost:27017/userdb", function(err, db) {
  if(!err) {
    var collection = db.collection('Employee');
	var stream = collection.find({"name":"naveen"}).stream();
	stream.on("data", function(item) {
		console.log("object found " + JSON.stringify(item))
	});
  }
});

//function to get status using promise
var connectToDatabase = function(){
    var promise = new Promise(function (resolve, reject) {
    MongoClient.connect("mongodb://localhost:27017/userdb", function(err, db) {
          if(!err) {
            resolve(db);
          }else{
              reject(err)
          }
    });
    	
  });
  return promise;
}

var getRecords = function(db){
    var promise = new Promise(function (resolve, reject) {
        var collection = db.collection('Employee');
        collection.find().toArray(function(err, items) {
 	      if(!err) {
            resolve(items);
          }else{
              reject(err)
          }   
        });
    });
  return promise;
};


var createCollection = function(db, collectionName){
  var promise = new Promise(function(resolve, reject){
      db.createCollection(collectionName, {strict:true}, function(err, collection) {
          if(!err) {
            resolve(collection);
          }else{
              reject(err)
          } 
      });
  })
  return promise;
};

//connectToDatabase().then(function(dbInstance){
//   console.log("connection success")
//    getRecords(dbInstance).then(function(response){
//        console.log("records: " + JSON.stringify(response))
//    }).catch(function(error){
//        console.log("error: " + error)
//    });
//}).catch(function(error){
//    console.log("error: " + error)
//});

connectToDatabase().then(function(dbInstance){
   console.log("connection success")
    getRecords(dbInstance).then(function(response){
        console.log("records: " + JSON.stringify(response))
        createCollection(dbInstance, "Student").then(function(response){
           console.log("insertion success " + response) 
        }).catch(function(error){
            console.log("error: " + error)
        });
    }).catch(function(error){
        console.log("error: " + error)
    });
}).catch(function(error){
    console.log("error: " + error)
});

