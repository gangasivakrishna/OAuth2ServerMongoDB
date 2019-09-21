var express = require('express'),
	bodyParser = require('body-parser');
const oAuth2Service = require('./authentication/OAuth2Service.js').getInstance();
const PORT = 5000;

var mongoose = require('mongoose');

var uristring = 'mongodb://localhost/test';

mongoose.connect(uristring,{ useNewUrlParser: true, useUnifiedTopology: true },function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.all('/oauth/token', oAuth2Service.obtainToken);
app.use(oAuth2Service.authenticateRequest);


app.get('/login', function(req, res) {
	res.send('Congratulations, you are in a secret area!');
});
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app;
