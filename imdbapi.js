var http = require("http"),
    mongodb = require("mongodb"),
    url = "http://www.omdbapi.com/?",
    _title = "t=",
    _releaseyear ="&y=",
    _type="&type=",
    jsondata = "",
    MongoClient ="",
    movietitle ="",
    request ="";

     //http://www.omdbapi.com/?t=Sultan&y=2015&type=movie

      movietitle = process.argv[2]; //movie title
      year = process.argv[3]; //release year

     url += _title+movietitle+_releaseyear+year+_type+"movie";

     MongoClient = mongodb.MongoClient;
    
    var mongourl = 'mongodb://localhost:27017/imdb';
     
     request = http.get(url,function(response){
        
        var data = "";
       
        response.on("data",function(imdbdata){
		jsondata = JSON.parse(imdbdata);
           	    
        });
        
        response.on("end",function(err){
            //console.log(jsondata);
       if(err){
		console.log('Error in imdb response');	
		}
	else
		{
		
 		// Use connect method to connect to the Server
        MongoClient.connect(mongourl, function (err, db) {
          if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
          } else {
      
            console.log('Connection established to', mongourl);
             // Get the documents collection
            var collection = db.collection('movies');

           collection.insert(jsondata, function (err, result) {
		
		if (err) {
			console.log(err);
		} 
		else	{
			console.log('Inserted %d documents into the "movies" collection. The documents inserted with "_id" are:', result.length, result);
		 }
		//Close connection
		db.close();
			});
		}
	});
		}
		});
		});
        
  