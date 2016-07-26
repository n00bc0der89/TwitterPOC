var kafka = require('kafka-node');
var HighLevelConsumer = kafka.HighLevelConsumer;
var Offset = kafka.Offset;
var Client = kafka.Client;
var topic = 'kafkasink';
var client = new Client('localhost:2181');
var payloads = [ { topic: topic }];
var sentimentAnalysis = require('./sentimentAnalysis');
var mongodb = require("mongodb");

var consumer = new HighLevelConsumer(client, payloads);

var offset = new Offset(client);

var  MongoClient = mongodb.MongoClient;
var mongourl = 'mongodb://localhost:27017/imdb';

consumer.on('message', function (message) {
   // console.log(message);
var resp = {};
var jsondata = {};
resp.tweet = JSON.parse(message.value).text;
resp.sentiment = sentimentAnalysis(resp.tweet);
//console.log(resp.tweet);
//console.log(resp.sentiment);

//Create JSON object of tweet and its sentiments details
jsondata = {"tweet":resp.tweet, "sentiment":resp.sentiment}

//Connect to Mongodb create collection and dump sentiment analysis

 MongoClient.connect(mongourl, function (err, db) {
          if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
          } else {
      
            console.log('Connection established to', mongourl);
             // Get the documents collection
            var collection = db.collection('moviename');

           collection.insert(jsondata, function (err, result) {
		if (err) {
			console.log(err);
		} 
		else {
			console.log('Inserted %d documents into the "moviename" collection. The documents inserted with "_id" are:', result.length, result);
		 }
		//Close connection
		db.close();
		});
		}
	});
});
consumer.on('error', function (err) {
    console.log('error', err);
});
consumer.on('offsetOutOfRange', function (topic) {
    console.log("------------- offsetOutOfRange ------------");
    topic.maxNum = 2;
    offset.fetch([topic], function (err, offsets) {
        var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
        consumer.setOffset(topic.topic, topic.partition, min);
    });
});