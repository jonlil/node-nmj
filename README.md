Network Media Jukebox Manager
========

Tested with Popcorn Media Hour a400 and ReadyNAS Ultra 4.
But all you need is nodejs, sqlite3

requirements
============
nodejs
npm


Installation
==========

```cli
npm install
bower install
```

Make a copy of `config.json-dist` and name it `config.json`.
Put `config.json` in the config folder. 
Also make sure the config suits your setup.

```cli
# start webserver
node index.js
```

### Run server as service in background

```cli
nohup node index.js > /var/log/nmj-www.log 2>&1&
nohup node imageserver.js > /var/log/nmj-imageserver.log 2>&1&
```

If you really want a nice frontpage with a wall you have to setup `imageserver.js` to have access to your media.