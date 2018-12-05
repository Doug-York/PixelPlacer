var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    userName : 'dwyork',
    password : '1p4sw0rd$',
    server : 'pixlplacer.database.windows.net',
    options : {
        encrypt : true,
        database : 'PixelColors'
    }
}

//var conn = new Connection(config);

function updatePixel(qry){
    var conn = new Connection(config);
    conn.on('connect', function(){
        var request = new Request(qry, function(err, count, rows){
        });
        conn.execSql(request);
    });
}

function fetchCanvas(socket){
    var conn = new Connection(config);
    conn.on('connect', function(){
        var request = new Request('SELECT * FROM pixel_stats', function(err,count,rows){
        });
        request.on('row', function(columns){
            socket.emit('pixel', columns);
        });
        conn.execSql(request);
    });
};

//runs on init to set all pixel colors to white
function setDatabase(){
    var conn = new Connection(config);
    var qry = 'DELETE FROM pixel_stats;';
    conn.on('connect',function(){
        var r = new Request(qry, function(err){
            if (err) console.log(err);
            console.log('database cleared');
            var y;
            for(y=0; y<52; y++){
              clearGridRow(y);
            }
        });
        conn.execSql(r);
    });
};

function getStats(socket, msg){
    var conn = new Connection(config);
    var q = 'SELECT * FROM pixel_stats WHERE x = ' + msg.x + ' AND y = '+msg.y; 
    conn.on('connect', function(){
        var request = new Request(q, function(err,count,rows){
            
        });
        request.on('row', function(columns){
            socket.emit('stats', columns);
        });
        conn.execSql(request);
    });
}

function clearGridRow(y){
    var x;
    var qry1 = '';
    var qry2 = '';
    for (x=0 ; x<30 ; x++){
        qry1 = qry1 + 'INSERT INTO pixel_stats VALUES (' + x + ','  + y + ' , \' \' ,' +  '\'#FFFFFF\', \' \');';
    }
    for (x=30 ; x<51 ; x++){
        qry2 = qry2 + 'INSERT INTO pixel_stats VALUES (' + x + ','  + y + ' , \' \' ,' +  '\'#FFFFFF\', \' \');';
    }
    var c1 = new Connection(config);
    var c2 = new Connection(config);
    c1.on('connect',function(){
        var reques = new Request(qry1, function(){
            console.log('clearing row: ' + y);
        });
        c1.execSql(reques);
    });
    c2.on('connect',function(){
        var reques = new Request(qry2, function(){
            console.log('clearing row: ' + y);
        });
        c2.execSql(reques);
    });
}

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
        var q = 'UPDATE pixel_stats SET modified_by =  \'' + msg.nick + '\' ,previous_color =  \'' + msg.color + '\' ,time_modified =\'' + msg.time + '\'';
        var condition = ' WHERE x = ' + msg.x + ' AND y = ' + msg.y;
        var qry = q + condition;
        console.log(qry);
        updatePixel(qry);
    });

    socket.on('load canvas', function(msg){
        fetchCanvas(socket);   
    });

    socket.on('check stats', function(msg){
        getStats(socket,msg);
    });
})

var port = process.env.PORT || 1337;
http.listen(port, function(){
    console.log("Server running at http://localhost:%d", port);
});

setDatabase();