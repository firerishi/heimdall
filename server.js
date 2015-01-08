// web hooks server

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var crypto    = require('crypto');
var hmac, calculatedSignature;

app.use(bodyParser.json()); // for parsing application/json

console.log('process.env.GITHUB_APP_TARS_TOKEN = ', process.env.GITHUB_APP_TARS_TOKEN);

app.post('/payload', function(req, res) {
	
	hmac = crypto.createHmac('sha1', process.env.GITHUB_APP_TARS_TOKEN);
	hmac.update(JSON.stringify(req.body));
	calculatedSignature = 'sha1=' + hmac.digest('hex');

	console.log(calculatedSignature);

	if (req.get('X-Hub-Signature') == calculatedSignature) {

		console.log('VERIFIED sender source is Github!');
	
		console.log(req.get('X-GitHub-Event') + ' in ' + 
			req.body.repository.full_name + ' by ' +
			req.body.sender.login + ' on ' + 
			new Date().toDateString()
		);

		res.end('OK');

	} else {
		res.end(500);
	}
		
})

app.listen(4567);