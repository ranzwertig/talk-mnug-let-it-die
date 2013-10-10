# Let it die

This talk is about keeping long running nodejs  processes up or better keep the applications up and robust.

## Structure

* Introduction
    * Who am I
    * whats the talk about

* Problems coming with longrunning processes
    * loosing connection to databases, queues, ...
    * memory leaks
    * dead ends in bad quality code
* Solutions
    * controlles shutdown on connection loss
        * monitoring connections
        * restart process on connection loss
        * memory profiling
            * tools
            * monitoring memory
        * design the applications to be able to fail a any time
            * atomic operations
            * design data to be written in a single operation (if there are no rollbacks)


### Problems coming up with long running processes

#### Database connections

* database connections can be disconnected for many reasons:
    * physical connection loss
    * db crashes
    * slow connections lead to timeouts
* so whats the problem with this:
    * the application does not necessarily crash
    * -> but the application not able to e.g. server requests, or whatever it has to do
* e.g. mongo
    * mongo queues operations in the driver until the connection is back.
    * there is not always an error coming up which can
* solution:
    * monitoring the db connection in the application and handle disconnects
    * best way is to restart the process to have a clear application state

#### Memory Leaks

* Example of leaking node express app
* how ro find leaks
* how to avoid leaks
* find leaks using external tools


###


* Application design
    * applications should be designed to fail in a controlled manner
    * it should't be elusive to see what happened
        * good and stable logging
    * the logging shouldn't fail
        * normal logs e.g to mongo
        * error or emerg logs to process.stderr
        * error logs which helps, do not just log error, stacktrace, ...
    * you should know what your application does
        * how much memory does it consume
        * how much cpu
        * how long are the usual e.g. response times and processing times
* Data design
    * data should be designed to do operations as atomic as possible
    * use databases which provides these functions
        * redis brpoplpush
        * queues in mongo (dont delete data until the process has finished)
            * 2 phase commits
        * mysql transactions
* Monitoring
    * upstart
        * restart the process on server upstart
    * forever
        * monitor the process and restart it after it got killed
    * monit
        * monitor memory, cpu
        * is the demon still up (touch on file)
