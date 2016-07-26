var csv = require("fast-csv");
var LinearRegression = require("shaman/index").LinearRegression;

var lr = null;
var singleinput = new Array(); 
var outputparam = new Array(); 

var gooddirector=new Array();
var baddirector = new Array();
var mediocredirector = new Array();
var greatactors = ["amitabh bachchan", "salman khan","amir khan","shahrukh khan","ranbir kapoor","ranveer singh","deepika padukone","akshay kumar"];
var goodactors = ["irfan khan","nawazuddin siddiqui","naseeruddin shah","paresh rawal"];

exports.getModel = function(callback){
csv
 .fromPath("text2.csv",{headers:true,escape:'"'})
 .on("data", function(data){
     
     var row = data;
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
     
    // var array = row.split(',');
     var genre = ["Drama", "Action", "Crime","Comedy","Biography","Thriller","Romance", "History", "Sport", "Mystery","Musical"];
     var input= new Array();
     var output = new Array();
     
     var g = row.Genre;
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
         switch (row.Genre.toLowerCase()) {
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
     if(row.imdbRating != undefined && row.imdbRating != "N/A")
     {
         if(row.imdbRating > 7)
         {
            input.push(2); 
            gooddirector.push(row.Director);
         }
         else if(5 < row.imdbRating && row.imdbRating < 7)
         {
             input.push(1); 
             mediocredirector.push(row.Director);
         }
         else
         {
             input.push(0); 
             baddirector.push(row.Director);
         }
         
     }
     else
     {
             input.push(0); 
             baddirector.push(row.Director);
     }
     
     //Derive actors rating
     var actors = row.Actors.split(',');
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
   
   positivescore = row.PositiveScore;
   negativescore = row.NegativeScore;
   
   if((positivescore == "N/A" || positivescore == undefined || positivescore == "") && (negativescore == "N/A" || negativescore == undefined || negativescore == "") )
   {
      if(row.imdbRating >= 7)
      {
       positivescore = getRandomArbitrary(0.4,0.6);
       input.push(Number(parseFloat(positivescore.toFixed(2))));
       
       negativescore = getRandomArbitrary(0.1,0.2);
       input.push(Number(parseFloat(negativescore.toFixed(2))));
      }
      else if(5 <= row.imdbRating && row.imdbRating < 7 )
      {
        positivescore = getRandomArbitrary(0.2,0.4);
        input.push(Number(parseFloat(positivescore.toFixed(2))));
        
        negativescore = getRandomArbitrary(0.2,0.4);
        input.push(Number(parseFloat(negativescore.toFixed(2))));
      }
      else
      {
         positivescore = getRandomArbitrary(0.1,0.2);
         input.push(Number(parseFloat(positivescore.toFixed(2))));
         
         negativescore = getRandomArbitrary(0.4,0.6);
         input.push(Number(parseFloat(negativescore.toFixed(2))));
      }
    
   }
   else
   {
    input.push(Number(positivescore));
    input.push(Number(negativescore)); 
    
   }
   
   
  /*  if(negativescore == "N/A" || negativescore == undefined || negativescore == "")
   {
      if(row.imdbRating >= 7)
      {
       negativescore = getRandomArbitrary(0.4,0.6);
       input.push(Number(parseFloat(negativescore.toFixed(2))));
      }
      else if(5 <= row.imdbRating < 7 )
      {
        negativescore = getRandomArbitrary(0.2,0.4);
        input.push(Number(parseFloat(negativescore.toFixed(2))));
      }
      else
      {
         negativescore = getRandomArbitrary(0.1,0.2);
         input.push(Number(parseFloat(negativescore.toFixed(2))));
      }
    
   }
   else
   {
    input.push(Number(negativescore)); 
    
   }
   */
  
   
   if(row.imdbRating != "N/A")
      output.push(parseFloat(row.imdbRating));
   else
      output.push(parseFloat("0"));
     
   singleinput.push(input);
     
   outputparam.push(output);
      
     
 })
 .on("end", function(){
     
     /* console.log("Input");
     console.log(singleinput);
     console.log("Output");
     console.log(outputparam);*/
    lr = new LinearRegression(singleinput,  outputparam,{
    algorithm: 'GradientDescent',
    saveCosts: true // defaults to false 
    });
        
        lr.train(function(err) {
   
       if (err) { 
        throw err; 
       }
       
        }); 
        
        //var m = [  2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0.4, 0 ];
        //console.log(lr.predict(m));
        
       return callback(lr);
   
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
