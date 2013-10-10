tail -f /var/log/queuedaemon-monit.sys.log

sudo start node-daemon
sudo stop node-daemon

sudo /etc/init.d/redis-server start
sudo /etc/init.d/redis-server stop