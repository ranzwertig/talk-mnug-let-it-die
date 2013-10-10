process.title = "test";

var PID_FILE  = __dirname + '/' + process.title+".pid";
var fs = require('fs');

fs.writeFileSync(PID_FILE, process.pid+"\n");

process.on("uncaughtException", function(err) {
    console.error("[uncaughtException]", err);
    return process.exit(1);
});

process.on("SIGTERM", function() {
    console.log("SIGTERM (killed by supervisord or another process management tool)");
    return process.exit(0);
});

process.on("SIGINT", function() {
    console.log("SIGINT");
    return process.exit(0);
});

process.on("exit", function() {
    return fs.unlink(PID_FILE);
});