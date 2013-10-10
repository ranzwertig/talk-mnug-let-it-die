/*jslint node: true */
'use strict';

var redis = require('redis');
var request = require('request');

// create the redis client
var client = redis.createClient();

var inQueueName = 'in';
var outQueueName = 'out';
var recoverQueueName = 'recover';

var stopNextCycleCb = null;

var preserverJob = function(cb) {
    // we use the rpoplpush command here
    client.rpoplpush(inQueueName, recoverQueueName, function(err, job){
        cb(err, job);
    });
};

var jobDone = function(job, cb) {
    client.lpush(outQueueName, job, function(err, set) {
        client.lpop(recoverQueueName, function(err, set) {
            cb(err, set);
        });
    });
};

var processJob = function(job, cb) {
    console.log('processing: ' + job);
    request(job, function (error, response, body) {
        var processedJob = job + ':' + response.statusCode;
        cb(error, processedJob);
    });
};

var stopDaemon = function(cb) {
    stopNextCycleCb = cb;
};

var recoverDaemon = function() {
    client.llen(recoverQueueName, function(err, jobCount) {
        if(!err && jobCount > 0) {
            client.rpoplpush(recoverQueueName, inQueueName, function(err, job) {
                console.log('recovered: ' + job);
                runDaemon();
            });
        } else {
            runDaemon();
        }
    });
};

var runDaemon = function() {

    if(stopNextCycleCb !== null) {
        stopNextCycleCb();
        return;
    }
    preserverJob(function(err, job) {
        if(job === null) {
            console.log('Queue drained');
            setTimeout(runDaemon, 2000);
            return;
        }

        processJob(job, function(err, job) {
            jobDone(job, function() {
                setTimeout(runDaemon, 1000);
            });
        });
    });

};

recoverDaemon();

process.on('SIGINT', function() {
   console.log('exiting process on SIGINT');
   stopDaemon(function() {
        process.exit(0);
   });
});

process.on('SIGTERM', function() {
   console.log('exiting process on SIGTERM');
   stopDaemon(function() {
        process.exit(0);
   });
});