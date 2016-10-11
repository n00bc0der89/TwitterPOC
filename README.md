# TwitterPOC

1	Using NodeJS as Kafka-MongoDB connector
-------------------------------------------------------
1.	Check whether zookeeper services are up using JPS command. Zookeeper service name can be identified as “QuorumPeerMain”
$ jps

2.	If not up, then start the zookeeper services by running following command on shell
$ sudo /opt/mapr/kafka_2.11-0.10.0.0/bin/zookeeper-server-start.sh -daemon /opt/mapr/kafka_2.11-0.10.0.0/config/zookeeper.properties

3.	Start Kafka server by running following command on shell
$ sudo /opt/mapr/kafka_2.11-0.10.0.0/bin/kafka-server-start.sh -daemon /opt/mapr/kafka_2.11-0.10.0.0/config/server.properties

4.	Start Mongo DB by running following command on shell
$ /opt/mapr/mongodb-linux-x86_64-rhel62-3.2.7/bin/mongod --fork --logpath /opt/mapr/mongodb-linux-x86_64-rhel62-3.2.7/log

5.	Once all services are up and running. Start Flume agent which takes flume config file twitterfeed.conf to pull tweets based on keyword mentioned (movie name) in config file and stores into Kafka sink.
nohup sudo /opt/mapr/apache-flume-1.6.0-bin/bin/flume-ng agent -n TwitterAgent -f /opt/mapr/twitterfeed.conf &

6.	Run NodeJs script - kafka-node-consumer.js – A connector which connects kafkasink, pulls tweet message, performs sentiment analysis and inserts into mongo table.
Node kafka-node-consumer.js

7.	Run NodeJS build predictive model to predict the movie rating – 
Testmodel.js – Trains model based on historical data stored in Mongo DB.
consumer.js - Internally calls Testmodel.js and predicts the movie based on trained model.

 Node consumer.js <moviename> 
 --------------------------------------------------------------------------------------------------
 
 2	Using Apache Storm as Kafka-MongoDB connector
 
 1.	Check whether zookeeper services are up using JPS command. Zookeeper service name can be identified as “QuorumPeerMain”
 
$ jps

2.	If not up, then start the zookeeper services by running following command on shell

$ sudo /opt/mapr/kafka_2.11-0.10.0.0/bin/zookeeper-server-start.sh -daemon /opt/mapr/kafka_2.11-0.10.0.0/config/zookeeper.properties

3.	Start Kafka server by running following command on shell

$ sudo /opt/mapr/kafka_2.11-0.10.0.0/bin/kafka-server-start.sh -daemon /opt/mapr/kafka_2.11-0.10.0.0/config/server.properties

4.	Start Mongo DB by running following command on shell

$ /opt/mapr/mongodb-linux-x86_64-rhel62-3.2.7/bin/mongod --fork --logpath /opt/mapr/mongodb-linux-x86_64-rhel62-3.2.7/log
5.	Start Storm services – nimbus,supervisor,ui

./storm nimbus
./storm supervisor
./storm ui

6.	Once all services are up and running. Start Flume agent which takes flume config file twitterfeed.conf to pull tweets based on keyword mentioned (movie name) in config file and stores into Kafka sink.

nohup sudo /opt/mapr/apache-flume-1.6.0-bin/bin/flume-ng agent -n TwitterAgent -f /opt/mapr/twitterfeed.conf &

7.	 Submit Storm jar into running cluster. – Here RunonCluster is an argument to twitterSATopology class to make it run on cluster and not as LocalCluster

./storm jar /user/root/TwitterPOC-1.0-SNAPSHOT.jar com.maek.POC.twitterSATopology RunonCluster

8.	Run NodeJS build predictive model to predict the movie rating – 
Testmodel.js – Trains model based on historical data stored in Mongo DB.
consumer.js - Internally calls Testmodel.js and predicts the movie based on trained model. 

Node consumer.js <moviename> 

Apart from above steps there are few scripts running on crontab.
Mongo script - loadSentimentScore.js which consolidates sentiment score per movie base and insert into sentimentScore mongo collection
Nodejs script - imdbapi.js which pulls the movie information from IMDB api and insert into movie mongo collection


