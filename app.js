var Twitter = require('twitter');
var express = require('express');
var app = require('express')();
var path = require('path');
var moment = require('moment');
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);


var client = new Twitter({
  consumer_key: 'vtYdFJBtQBmK4FOqY2fxO9KKB',
  consumer_secret: 'l57ROShrIIWZVcpb6LdUYUc6cujpCjFEx7guj0qMtwvu3nIdYt',
  access_token_key: '844585279-2D9VpCIeHTi1nJVTyBab4dAOgmR5EnzxwYDDqMBa',
  access_token_secret: '5fMfTEym2tNAsZLLoivtzCNjGGwUUhObvqFbPIoyPQHAh'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

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

app.post('/Twitter/getDataFromWords', function(req, res) {
    var word = req.body.word;
    if (word == undefined) {
        res.status(400).send("word is not defined")
        return
    }
    
    client.get('search/tweets', {q: word}, function(error, tweets, response) {
        var finalArray = tweets.statuses.map(function(obj) {
            
            
            var objToReturn = {};
            objToReturn.text = obj.text;
            objToReturn.date = obj.created_at;
            objToReturn.nFavorites = obj.favorite_count;
            objToReturn.nRetweets = obj.retweet_count;


            var user = {};
            user.ID = obj.user.id;
            user.IDString = obj.user.id_str;
            user.name = obj.user.name;
            user.location = obj.user.location;
            user.img = obj.user.profile_image_url;
            
            objToReturn.user = user;
            return objToReturn;
        });
        res.status(200).json(finalArray);
        return
    });
});

/**
 * Gets the twitter.com stream from topics
 */

/*client.stream('statuses/filter', {track: "Portugal"}, function(stream) {
    stream.on('data', function(event) {
        // console.log(event && event.text);
        // console.log("Começa o pedido\n\n");
        // console.log(event);
        // console.log("\n\n\n");

        var objToReturn = {};
        objToReturn.text = event.text;
        objToReturn.date = event.created_at;
        objToReturn.nFavorites = event.favorite_count;
        objToReturn.nRetweets = event.retweet_count;


        var user = {};
        user.ID = event.user.id;
        user.IDString = event.user.id_str;
        user.name = event.user.name;
        user.location = event.user.location;
        user.img = event.user.profile_image_url;
        
        objToReturn.user = user;
        console.log(objToReturn);
    });
 
    stream.on('error', function(error) {
        throw error;
    });
});*/

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

console.log("Listening on port 3000");