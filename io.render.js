/* Mostly handle front-end render problem */
/* Parsing command from battle server log */
/* And Using Socket.io to update client   */
const express = require('express');
const app = express();
const io = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');

/* core */
// const logger = require('./back-end/logger');

/* Redirect views path */
app.set('views',path.join(__dirname,'client-service/views'));
/* Setting static directory - image use */
app.use(express.static('client-service/images'));
app.use(express.static('client-service/sound'));
app.use(express.static('client-service/js'));
app.use(bodyParser.urlencoded({extended: false}));
/* Setting view engine as ejs */
app.set('view engine','ejs');

const server = require('http').createServer(app);

/* Battle command */
var battle_cmd = '';
var cmd_flag = false;

app.post('/socket_test',function(req,res){
    /* Handle command from battle server */
    // logger.record('io.render','[io.render] Get Battle server request.');
    console.log('[io.render] Get Battle server request.');
    /* FIXME Parsing the command from battle server, and then pack them to render log */
    battle_cmd = req.body;
    /* emit socket once */
    cmd_flag = true;
    /* Send back message to battle server */
    res.end('OK, Server get: '+JSON.stringify(battle_cmd));
});

app.get('/pixi',function(req,res){
    /* Use for Testing Pixi */
    // logger.record('io.render','[io.render] Get Pixi test.');
    console.log('[io.render] Get Pixi test.');
    res.render('pixi',{
    });
});

app.get('/socket.io',function(req,res){
    /* Use for Testing socket io */
    // logger.record('io.render','[io.render] Get Socket io request.');
    console.log('[io.render] Get Socket io request.');
    res.render('socket',{
        title: "Socket Test"
    });
});

// Listen url request
server.listen(process.env.npm_package_config_portiorender, function(){
    var host = server.address().address;
    var port = server.address().port;
    // logger.record('io.render',"[io.render] Example app listening at "+host+" : "+port);
    console.log("[io.render] Example app listening at "+host+" : "+port);
});

var io_render = io.listen(server);

io_render.sockets.on('connection', function(socket){
  /* Connection build and send message */
  /* Receive error case from client */
  socket.on("er", function (error) {
      // we received a tweet from the browser
      // logger.record('io.render','[io.render - Error] Error Case: ' + error.case + '. [Client] ' + socket.request.connection.remoteAddress,'error');
      console.log('[io.render - Error] Error Case: ' + error.case + '. [Client] ' + socket.request.connection.remoteAddress);
  });

  socket.on("disconnect",function(){
      // logger.record('io.render','[io.render] Client: ' + socket.request.connection.remoteAddress + ' , disconnect.');
      console.log('[io.render] Client: ' + socket.request.connection.remoteAddress + ' , disconnect.');
      clearInterval(update);
  });

  /* Record client info */
  // logger.record('io.render','[io.render] New connection from ' + socket.request.connection.remoteAddress);
  console.log('[io.render] New connection from ' + socket.request.connection.remoteAddress);

  /* Start filter */
  var update = setInterval(function() {
    // When command receive from target source , emit command to client to update status
    if(cmd_flag){
      socket.emit('raw', {
    		'cmd': battle_cmd.cmd
    	});
      cmd_flag = false;
    }
}, 1000);

});
