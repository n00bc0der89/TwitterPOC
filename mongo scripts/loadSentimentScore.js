var totaltweets = db.moviename.find({"tweet":/#Raees/}).count();	//Calculate total incoming tweets count
var positivetweetcounts = db.moviename.find({"tweet":/#Raees/,"sentiment.score": {$gt : 0}}).count();	//Calculate total positive tweets count
var negativetweetcounts = db.moviename.find({"tweet":/#Raees/,"sentiment.score": {$lt : 0}}).count();	//Calculate total negative tweets count

var positivescore = positivetweetcounts/totaltweets;
var negativescore = negativetweetcounts/totaltweets;
print(positivescore);
print(negativescore);
db.sentimentScore.insert({"movie":"Raees","positivescore":positivescore,"negativescore":negativescore});
print("Complete");