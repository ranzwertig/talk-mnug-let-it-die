/*jslint node: true */
'use strict';

var fs = require('fs');

var logger = exports;

logger.level = 'warning';

logger.levelMap = {
    'emerg': 0,
    'error': 1,
    'warning': 2,
    'info': 3,
    'debug': 4
};

logger.alive = function() {
    var atime = (new Date()).getTime();
    var mtime = (new Date()).getTime();
    fs.utimes('/var/log/node-daemon-alive.log', atime, mtime, function(err){});
};

logger.log = function(level, message) {
    if(logger.levelMap[level] > logger.levelMap[logger.level]) {
        return;
    }
    if(level === 'emerg') {
        process.stderr.write(level + ': ' + message + '\n');
        process.exit(1);
    } else {
        process.stdout.write(level + ': ' + message + '\n');
    }
};

logger.emerg = function(message) {
    logger.log('emerg', message);
};

logger.error = function(message) {
    logger.log('error', message);
};

logger.warning = function(message) {
    logger.log('warning', message);
};

logger.info = function(message) {
    logger.log('info', message);
};

logger.debug = function(message) {
    logger.log('debug', message);
};

logger.handleUncaughtException = function(err) {
    logger.emerg(err);
};

process.on('uncaughtException', logger.handleUncaughtException);