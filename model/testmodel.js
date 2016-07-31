var csv = require("fast-csv");
var LinearRegression = require("shaman/index").LinearRegression;
var mongodb = require('mongodb');
var lr = null;
var singleinput = new Array(); 
var outputparam = new Array(); 

var gooddirector=new Array();
var baddirector = new Array();
var mediocredirector = new Array();
var greatactors = ["amitabh bachchan", "salman khan","amir khan","shahrukh khan","ranbir kapoor","ranveer singh","deepika padukone","akshay kumar","priyanka chopra","aishwarya","sanjay dutt"];
var goodactors = ["irrfan khan","nawazuddin siddiqui","naseeruddin shah","paresh rawal","nana patekar","john abraham","katrina kaif","manoj bajpai","kareena kapoor"];
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/imdb';
var query_sentiment={};
var sentimentObj = null;

exports.getModel = function(callback){

MongoClient.connect(url, function (err, db) {
  
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } 
  
  else 
  {
	//console.log('Connection established from training model to', url);
    
    var collection = db.collection('movies');
    var sentimentsc = db.collection('sentimentScore');
	
	collection.aggregate([ { $lookup: { from:"sentimentScore", localField:"Title", foreignField:"movie", as:"moviename" } } ]).toArray(function (err, result) {
	
	if (err) {
        console.log(err);
      } 
	  else if (result.length){
	
    // console.log("Length: "+ result.length);

    // var array = row.split(',');
     var genre = ["Drama", "Action", "Crime","Comedy","Biography","Thriller","Romance", "History", "Sport", "Mystery","Musical"];
	 var counter = 0;
	 for(var i in result){

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
	var positivescore = 0;
	var negativescore = 0;
	 
	 var input= new Array();
     var output = new Array();
     
	if(result[i].Error == undefined && result[i].imdbRating != "N/A")
	{
	counter++;
     var g = result[i].Genre;
	//console.log("Movie "+ result[i].Title);
     if(g.indexOf(',') > -1)
     {
         var genrearray = g.split(',');
         
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
         switch (result[i].Genre.toLowerCase()) {
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
          //Derive director rating out from movie rating
     if(result[i].imdbRating != undefined && result[i].imdbRating != "N/A")
     {
         if(result[i].imdbRating > 7)
         {
            input.push(2); 
            gooddirector.push(result[i].Director);
         }
         else if(5 < result[i].imdbRating && result[i].imdbRating < 7)
         {
             input.push(1); 
             mediocredirector.push(result[i].Director);
         }
         else
         {
             input.push(0); 
             baddirector.push(result[i].Director);
         }
         
     }
     else
     {
             input.push(0); 
             baddirector.push(result[i].Director);
     }
     
     //Derive actors rating
	
     var actors = result[i].Actors.split(',');
     var rating = 0;
     for (var a in actors) {
         
         if(greatactors.indexOf(actors[a].trim().toLowerCase()) > -1)
         {
             rating += 2;
            // input['actor_rating'][i]  = rating; 
         }
         else if(goodactors.indexOf(actors[a].trim().toLowerCase()) > -1)
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
   
   //positivescore = result[i].PositiveScore;
   //negativescore = result[i].NegativeScore;

sentimentObject = result[i].moviename;
var pavg =0;
var navg =0;
var count =0;
if(sentimentObject != undefined)
{
for(var index in sentimentObject)
{
pavg += sentimentObject[index].positivescore;
navg += sentimentObject[index].negativescore;
count++;
}
positivescore = pavg/count;
negativescore = navg/count;
}
   
  /* if((positivescore == "N/A" || positivescore == undefined || positivescore == "") && (negativescore == "N/A" || negativescore == undefined || negativescore == "") )
   {
      if(result[i].imdbRating >= 7)
      {
       //positivescore = getRandomArbitrary(0.4,0.6);
       positivescore = 0.65;
	input.push(Number(parseFloat(positivescore.toFixed(2))));
       
       //negativescore = getRandomArbitrary(0.1,0.2);
       negativescore = 0.13;
	input.push(Number(parseFloat(negativescore.toFixed(2))));
      }
      else if(5 <= result[i].imdbRating && result[i].imdbRating < 7 )
      {
        //positivescore = getRandomArbitrary(0.2,0.4);
       positivescore = 0.35; 
	input.push(Number(parseFloat(positivescore.toFixed(2))));
        
        //negativescore = getRandomArbitrary(0.2,0.4);
	negativescore = 0.24;                
	input.push(Number(parseFloat(negativescore.toFixed(2))));
      }
      else
      {
         //positivescore = getRandomArbitrary(0.1,0.2);
	positivescore = 0.15;  
	input.push(Number(parseFloat(positivescore.toFixed(2))));
         
         //negativescore = getRandomArbitrary(0.4,0.6);
	  negativescore = 0.55;
         input.push(Number(parseFloat(negativescore.toFixed(2))));
      }
    
   }
   else
   {
    input.push(Number(positivescore));
    input.push(Number(negativescore)); 
    
   }*/

if(positivescore >= 0 && negativescore >= 0)
{
  input.push(Number(parseFloat(positivescore.toFixed(2))));
  input.push(Number(parseFloat(negativescore.toFixed(2)))); 
}
else
{
  input.push(Number(0));
  input.push(Number(0)); 

}
   if(result[i].imdbRating != "N/A")
      output.push(parseFloat(result[i].imdbRating));
   else
      output.push(parseFloat("0"));
     
   singleinput.push(input);
     
   outputparam.push(output);
	 
	 }
    }
	 //Predict the model
	 
		console.log("Input");
		console.log(singleinput);
		console.log("Output");
		console.log(outputparam);
	 
		lr = new LinearRegression(singleinput,  outputparam,{
		algorithm: 'GradientDescent',
		saveCosts: true // defaults to false 
		});
        
       	 lr.train(function(err) {   
       		if (err) { 
        		throw err; 
       	}       
        	}); 
        console.log("Total movies processed: "+ counter);
       // var m = [  2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0.4, 0 ];
       // console.log(lr.predict(m));
        return callback(lr); 
    } 
      
 });
}

});
}


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

exports.goodDirec = gooddirector;
exports.mediocreDirec = mediocredirector;
exports.badDirec = baddirector;
exports.greatact = greatactors;
exports.goodact = goodactors;