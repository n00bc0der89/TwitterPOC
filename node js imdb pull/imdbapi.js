var http = require("http"),
    mongodb = require("mongodb"),
    url = "http://www.omdbapi.com/?",
    title = "t=",
    movieid ="i",
    jsondata = "",
    MongoClient ="",
    movietitle ="",
    request ="";
     
      movietitle = process.argv[2]; //movie title
    
     url += title+movietitle;
     MongoClient = mongodb.MongoClient;
      // Connection URL. This is where your mongodb server is running.
    var mongourl = 'mongodb://localhost:27017/imdb';
     
     request = http.get(url,function(response){
        
        var data = "";
       
        response.on("data",function(imdbdata){
           jsondata = JSON.parse(imdbdata);
           //jsondata = imdbdata;
        });
        
        response.on("end",function(err){
            //console.log(jsondata);
            
            // Use connect method to connect to the Server
        MongoClient.connect(mongourl, function (err, db) {
          if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
          } else {
            //HURRAY!! We are connected. :)
            console.log('Connection established to', mongourl);
             // Get the documents collection
            var collection = db.collection('movies');

            // Insert some users
					collection.insert(jsondata, function (err, result) {
					  if (err) {
						console.log(err);
					  } else {
						console.log('Inserted %d documents into the "movies" collection. The documents inserted with "_id" are:', result.length, result);
					  }
					//Close connection
					db.close();
					});
				}
			});
		
		});
		});
        
  