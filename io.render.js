/* Mostly handle front-end render problem */
/* Parsing command from battle server log */
/* And Using Socket.io to update client   */
const express = require('express');
const app = express();
const url = require('url');
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

/* Get Command */
app.get('/game_start', function(req,res){
    console.log('[io.render] Game Start.');
    // using get parameter
    var players = url.parse(req.url , true);
    console.log('[io.render] Match Player 1: ' + players.query.p1 + "; Match Player 2: " + players.query.p2);
    res.render('arena_game',{
        p1: players.query.p1,
        p2: players.query.p2
    });
    var connect_manager = require('./player_channel');
    connect_manager.player_channel(players.query.p1+players.query.p2,server);
})

// Listen url request
server.listen(process.env.npm_package_config_portiorender, function(){
    var host = server.address().address;
    var port = server.address().port;
    // logger.record('io.render',"[io.render] Example app listening at "+host+" : "+port);
    console.log("[io.render] Example app listening at "+host+" : "+port);
});

/*var io_render = io.listen(server);
var nsp = io_render.of('/game');
nsp.on('connection',function(socket){
    console.log('[io.render] New Connection from ' + socket.request.connection.remoteAddress);
    var update = setInterval(function() {
        // When command receive from target source , emit command to client to update status
        socket.emit('raw', {
        	'cmd': battle_cmd.cmd
        });
    }, 1000);
});
*/
