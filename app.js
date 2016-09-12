var express = require('express');
var bodyparser = require('body-parser');
var connection = require('./connection');
var routes = require('./routes');

var app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

connection.init();
routes.configure(app);

var server = app.listen(8000, function() {
  process.env.TZ = 'America/Campo_Grande';
  console.log(new Date().toString())
  console.log('Server listening on port ' + server.address().port);
});
