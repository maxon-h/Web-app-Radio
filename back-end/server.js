const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://maks:qwerty123@stations-bnsjn.mongodb.net/test?retryWrites=true";
const ObjectID = require('mongodb').ObjectID;

app.set('json spaces', 2);
app.use(bodyParser.json());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

MongoClient.connect(uri, { useNewUrlParser: true }, (error, client) => {
    if(error) {
        throw error;
    }
    database = client.db('data');
    collection = database.collection('stations');
    console.log("Connected to `" + 'data' + "`!");
    app.listen(port, function(){
        console.log("Сервер ожидает подключения...");
    });
});

app.get('/stations', function(req,res){
    collection.find({}).toArray((err, stations) => {
        if(err) {
            return response.status(500).send(err);
        }
        res.json(stations);
    });
})

app.get('/stations/:id', function(req,res){
    let id = req.params.id;
    collection.findOne({_id: ObjectID(id)}, (err,station) => {
        if(err) {
            return response.status(500).send(err);
        }
        res.json(station);
    })
})

app.put('/stations/put/:id', function (req, res) {
    let updStation = req.body;
    let id = req.params.id;
    if(updStation.name === '' || updStation.url === ''){
        res.status(500).json({
            error: 'Name or url is not provided'
        })
    }
    delete updStation._id;

    collection.updateOne({_id: ObjectID(id) }, {$set: updStation}, (err, stations) => {
        if (err) {
            res.send(err);
        }
        res.json(stations);
    })
});

app.post('/stations/post', function(req, res) {
    let newStation = req.body;

    if(newStation.name === '' || newStation.url === ''){
        res.status(500).json({
            error: 'Name or url is not provided'
        })
    }
    collection.insertOne(newStation, function(err, station){ 
        if(err){
            res.status(500).json(err);
        }
        res.json(station);
    })
})

app.delete('/stations/delete/:id', function (req, res) {
    let id = req.params.id;
    collection.deleteOne({_id: ObjectID(id) }, (err, station) => {
        if (err) {
            res.status(500).json(err)
        }
        res.json(station);
    })
});