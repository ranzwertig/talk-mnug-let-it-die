# Let it die – long running processes in nodejs

## slides

For the slides just go to https://ranzwertig.github.com/talk-mnug-let-it-die.

## Examples

All node examples can be found in the node/ folder.

There is a vagrant, ansible virtual machine in the vbox folder. Just install vagrant and ansible do

    $ cd vbox
    $ vagrant up --provision

It should set up an ubuntu server starting the queuedaemon-monit.js as a node daemon.
You can start/stop it with:

    $ sudo start node-daemon
    $ sudo stop node-daemon

You can find the upstart configuration in

    /etc/init/node-daemon.conf

The monit configuration in

    /etc/monit/conf.d/node-daemon.conf

There is a pid file of the process in

    /var/run/node-daemon.pid

All logs are located in

    /var/log/node-daemon.log
    /var/log/node-daemon-alive.log

## License

MIT