var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req,res){
    res.sendFile(__dirname + '/frontend' + '/index.html');
})

app.get('/index.css', function(req,res){
    res.sendFile(__dirname + '/frontend' + '/index.css');
})

app.get('/index.js', function(req,res){
    res.sendFile(__dirname + '/frontend' + '/index.js');
})

io.on('connection', function(socket){
    socket.on('update pixel', function(msg){
        console.log('pixel update' + msg.toString());
        io.emit('pixel update', msg);
    })
    console.log('new user connected');
})

var port = process.env.PORT || 1337;
http.listen(port, function(){
    console.log("Server running at http://localhost:%d", port);
});