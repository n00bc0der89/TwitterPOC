var mongodb = require('mongodb');
var LinR = require('./testmodel');
var input = new Array();

var drama= 0;
 var action=0;
 var crime=0;
 var comedy=0;
 var biography = 0;
 var thriller=0;
 var romance=0;
 var history=0;
 var sport=0;
 var mystery=0;
 var musical=0;
var imdbRating = 0;
var positivescore = 0;
var negativescore = 0;
var query_movie= {};
var query_sentiment={};

var MongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost:27017/imdb';
var moviename = process.argv[2];
//console.log(moviename);
query_sentiment['movie']= moviename;
query_movie['Title']=moviename;

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {

    console.log('Connection established to', url);
    var collection = db.collection('movies');
    var sentimentsc = db.collection('sentimentScore');
	
LinR.getModel(function(res){

sentimentsc.find(query_sentiment).sort({_id:-1}).limit(1).toArray(function (err, result) {
        if (err) {
	  console.log(err);
      } else if (result.length) {
      
          positivescore = result[0].positivescore;
          negativescore = result[0].negativescore;
         // console.log("PScore" + positivescore);
        //  console.log("NScore" + negativescore);
          
      }

	 collection.find(query_movie).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
       var genre = result[0].Genre;
       var director = result[0].Director;
       var actor = result[0].Actors;
	imdbRating = result[0].imdbRating;

       if(genre.indexOf(',') > -1)
     {
         var genrearray = genre.split(',');
         
         for (var gen in genrearray) {
             
             switch (genrearray[gen].toLowerCase().trim()) {
             case 'drama':
                 drama = 1;
                 break;
              case 'action':
                 action = 1;
                 break;
              case 'crime':
                 crime = 1;
                 break;
             case 'comedy':
                 comedy = 1;
                 break;     
             case 'biography':
                 biography = 1;
                 break;
             case 'thriller':
                 thriller = 1;
                 break;
             case 'romance':
                 romance = 1;
                 break;
             case 'history':
                 history = 1;
                 break;
             case 'sport':
                 sport = 1;
                 break;
             case 'mystery':
                 mystery = 1;
                 break;
             case 'musical':
                 musical = 1;
                 break;
            
             default:
                 // code
         }
             
         }
         
         
     }
     else
     {
         switch (genre.toLowerCase()) {
             case 'drama':
                 drama = 1;
                 break;
              case 'action':
                 action = 1;
                 break;
              case 'crime':
                 crime = 1;
                 break;
             case 'comedy':
                 comedy = 1;
                 break;     
             case 'biography':
                 biography = 1;
                 break;
             case 'thriller':
                 thriller = 1;
                 break;
             case 'romance':
                 romance = 1;
                 break;
             case 'history':
                 history = 1;
                 break;
             case 'sport':
                 sport = 1;
                 break;
             case 'mystery':
                 mystery = 1;
                 break;
             case 'musical':
                 musical = 1;
                 break;
            
             default:
                 // code
         }
     }
       if(LinR.goodDirec.indexOf(director) > -1)
     {
         input.push(2);
     }
     else if(LinR.mediocreDirec.indexOf(director) > -1)
     {
         input.push(1);  
     }
     else 
     {
         input.push(0);
     }
     
     
     var actors = actor.split(',');
     var rating = 0;
     for (var a in actors) {
         
         if(LinR.greatact.indexOf(actors[a].trim().toLowerCase()) > -1)
         {
             rating += 2;
            // input['actor_rating'][i]  = rating; 
         }
         else if(LinR.goodact.indexOf(actors[a].trim().toLowerCase()) > -1)
         {
             rating += 1;
            // input['actor_rating'][i] = rating; 
         }
         else 
         {
             rating += 0;
             
         }
     }
     input.push(rating); 
     
   input.push(crime);
   input.push(comedy);
   input.push(biography);
   input.push(thriller);
   input.push(romance);
   input.push(history);
   input.push(sport);
   input.push(mystery);
   input.push(musical);
   input.push(drama);
   input.push(action);     
   input.push(Number(parseFloat(positivescore.toFixed(2))));
   input.push(Number(parseFloat(negativescore.toFixed(2))));

     
       console.log("Input to Model: " + input);
    	console.log("Movie to predict: "+ moviename);
	console.log("IMDB rating of the movie: "+ imdbRating);
      var prating = res.predict(input);
      console.log("Movie Rating predicted: "+ Number(parseFloat(prating.toFixed(1))));
       
      } else {
        console.log('No document(s) found with defined "find" criteria!');
      }
      //Close connection
      db.close();
    });
        
    });
});
    

   
  }
});