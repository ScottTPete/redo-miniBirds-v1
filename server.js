var express = require('express'),
	bodyParser = require('body-parser'),
	cors = require('cors'),
	mongojs = require('mongojs'),
	app = express();



app.use(bodyParser.json());
app.use(cors());


//setup db and check if it's running/has an error
var db = mongojs('birds', ['sightings']),
	birdId = mongojs.ObjectId;


db.on('error', function (err) {
	console.log('database error', err)
})

db.once('connect', function () {
	console.log('database connected')
})


app.post('/api/sighting', function(req, res, next) {
	db.sightings.save(req.body, function(err, response) {
		if(err) {
			return res.status(500).send(err)
			console.log('could not post bird')
		} else {
			return res.status(200).json(response);
			console.log('new sighting saved')
		}
	})
})

app.get('/api/sighting', function(req, res, next) {
	db.sightings.find({name: req.query.name}, function(err, response) {
		if(err) {
			return res.status(500).send(err);
			console.log('could not get the bird')
		} else {
			return res.status(200).json(response);
			console.log('you got a bird')
		}
	})
});

app.put('/api/sighting', function(req, res, next) {
	db.sightings.update({_id: birdId(req.query.id)}, {$set: req.body}, function(err, response) {
		if(err) {
			return res.status(500).send(err)
		} else {
			return res.status(200).json(response);
		}
	}) 
})

app.delete('/api/sighting', function(req, res, next) {
	db.sightings.remove({_id: birdId(req.query.id)}, function(err, response) {
		if(err) {
			return res.status(200).send(err);
		} else {
			return res.status(200).json(response);
		}
	})
})


















//SET UP PORT//
var port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log('Listening on port ' + port);
})