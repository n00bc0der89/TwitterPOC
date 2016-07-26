In order to avoid getting random tweets with random language -

do not use 

TwitterAgent.sources.TwitterSource.type=org.apache.flume.source.twitter.TwitterSource

replace above with

TwitterAgent.sources.TwitterSource.type=com.cloudera.flume.source.TwitterSource

And add flume-sources-1.0-SNAPSHOT.jar into lib folder of flume-1.6.0 - This library contains necessary com.cloudera.flume.source.TwitterSource class to run twittersource with keywords filter.

link where actual code of TwitterSource present:
https://github.com/cloudera/cdh-twitter-example/blob/master/flume-sources/src/main/java/com/cloudera/flume/source/TwitterSource.java

Also existing twitter4j libraries of 3.x which is present in flume lib folder has methods which conflict with methods present in flume-sources-1.0-SNAPSHOT.jar which we have added and it gives error while running flume - agent

Error :
ERROR node.PollingPropertiesFileConfigurationProvider: Unhandled error
java.lang.NoSuchMethodError: twitter4j.conf.Configuration.isStallWarningsEnabled()Z


So dump twitter4j-2.2.6 version in lib folder and delete 3.x versions of twitter4j.

Last step is to add flume-sources-1.0-SNAPSHOT.jar into FLUME_CLASSPATH
Go into conf folder of flume and rename flume-env.sh.template to flume-env.sh and edit the file to uncomment 
FLUME_CLASSPATH.
Set as below
FLUME_CLASSPATH="/opt/mapr/apache-flume-1.6.0-bin/lib/flume-sources-1.0-SNAPSHOT.jar"

Now run the flume agent. I am able to get proper tweets(no special and weird characters like before) now with keywords set in flume conf.
