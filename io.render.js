/* Mostly handle front-end render problem */
/* Parsing command from battle server log */
/* And Using Socket.io to update client   */
const express = require('express');
const app = express();
const fs = require('fs');
const url = require('url');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');
const jsfs = require('jsonfile');
const IO = require('socket.io');
/* core */
const config = jsfs.readFileSync(__dirname+"/config.json");
var battle_record_storage;
// var logger = require('./server-service/core/logger.js');

/* Use for battle recording
    - battle_room : record battle creation time
    - battle_recording : record battle commands
*/
var battle_room = {};
var battle_recording = {};
/* Use for connection table */
var socket_channel = [];

/* Base on platform to decide storage path */
if(process.platform == "win32"){
    // if run on Windows, using current directory as storage
    battle_record_storage = __dirname + '/' + config.server_root + '/' + config.server_battle_record;
}
else if(process.platform == "linux"){
    // if run on Linux, using /tmp
    battle_record_storage = '/tmp/' + config.server_root + '/' + config.server_battle_record;
}

/* Redirect views path */
app.set('views',path.join(__dirname,'client-service/views'));
/* Setting static directory - image use */
app.use(express.static('client-service/images'));
app.use(express.static('client-service/sound'));
app.use(express.static('client-service/js'));
app.use(express.static('client-service/css'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
/* Setting view engine as ejs */
app.set('view engine','ejs');

const server = require('http').createServer(app);
var io = new IO().listen(server);

/* Get start Command */
app.get('/game_start', function(req,res){
    // using get parameter
    var players = url.parse(req.url , true);
    /* If there have no room , create one for it */
    var create_time = moment().format('YYYY-MM-DD-hh-mm-ss-a');
    // Register a room as record
    if(battle_room[players.query.p1+players.query.p2] != undefined){
        // already build
    }
    else{
        // Build a room for this pair
        console.log('[io.render][Create Battle Room] Player 1: ' + players.query.p1 + "; Player 2: " + players.query.p2);
        battle_room[players.query.p1+players.query.p2] = create_time;
        var record_data = {
            content: []
        };
        battle_recording[players.query.p1+players.query.p2] = record_data;
    }
    res.render('arena_game',{
        p1: players.query.p1,
        p2: players.query.p2,
        port: process.env.npm_package_config_portcontrol
    });
});

// Get Streaming 
app.get('/streaming', function(req,res){
    // using get parameter
    let players = url.parse(req.url , true);
    /* If there have no room , create one for it */
    let streaming_room = players.query.room;
    console.log('[io.render][Streaming room] Open at :' + req.connection.remoteAddress);
    res.render('arena_game',{
        p1: players.query.p1,
        p2: players.query.p2,
        port: process.env.npm_package_config_portcontrol
    });
});

/* Check connection status */
app.get('/check_connection', function(req,res){
    /* Update connection list */
    // FIXME : get socket information / or maintain the room table
    console.log('[io.render] Checking current connection !');
    res.render('connection_table',{
        title: 'Connection Table',
        col1: '標籤',
        col2: 'IP位置',
        col3: '建立時間',
        col4: '觀賞直播',
        col5: 'player 1',
        col6: 'player 2',
        content: socket_channel
    });
});

/* Replay mechanism */
app.get('/replay_list',function(req,res){
    /* Fetch replay directory */
    // If query is empty , show all
    var list_info = url.parse(req.url , true);
    fs.readdir(battle_record_storage,function(err,files){
        if(err){
            console.log("[io.render][Error readdir] : " + battle_record_storage);
        }
        else {
            /* Render choosing page */
            res.render('replay_list',{
                title: 'Replay Lobby',
                col1: '戰鬥時間',
                col2: '對戰人員1',
                col3: '對戰人員2',
                col4: '勝利者',
                content: files,
                filter: list_info.query.search
            });
        }
    });
});

/* Get replay target */
app.get('/go_replay',function(req,res){
    /* Get target name */
    var info = url.parse(req.url , true);
    var target = info.query.replay;
    console.log('[io.render][Record Usage] Prepare replay record - ' + target);
    /* Fetch data */
    if(fs.existsSync(battle_record_storage+'/'+target)){
        jsfs.readFile(battle_record_storage+'/'+target,function(err,battle_log){
            if(err){
                console.log("[io.render][Error Read log]: " + battle_record_storage+'/'+target);
            }
            else {
                // send total log , using player_channel
                res.render('arena_game_replay',{
                    script: target+req.connection.remoteAddress,
                    log: battle_log
                });
                // Using client address to distinguish room
                setTimeout(function(){
                    io.in('room-'+target+req.connection.remoteAddress).emit('replay',battle_log);
                },3000);
            }
        });
    }
    else{
        res.end('Sorry , can\'t find your replay target. Please try again!');
    }
});

// Post method of game command
app.post('/game_cmd',function(req,res){
    var cmd = req.body.cmd;
    var player1 = req.body.p1;
    var player2 = req.body.p2;
    var c_minion_list,n_minion_list,b_list,p1_cur_hand_list,p2_cur_hand_list;
    var battle_time = req.body.current_time,p1_mana = req.body.current_mana_p1,p2_mana = req.body.current_mana_p2;

    if(typeof req.body.current_minion == 'string'){
        // if sending data are type string, do parse (only need one variable to detect)
        c_minion_list = JSON.parse(req.body.current_minion);
        n_minion_list = JSON.parse(req.body.new_minion);
        b_list = JSON.parse(req.body.buildings);
        p1_cur_hand_list = JSON.parse(req.body.current_hand_p1);
        p2_cur_hand_list = JSON.parse(req.body.current_hand_p2);
    }
    else{
        c_minion_list = req.body.current_minion;
        n_minion_list = req.body.new_minion;
        b_list = req.body.buildings;
        p1_cur_hand_list = req.body.current_hand_p1;
        p2_cur_hand_list = req.body.current_hand_p2;
    }

    /* Parsing command here */
    var json_obj = {
        cmd: cmd,
        current_minion: c_minion_list,
        new_minion: n_minion_list,
        buildings: b_list,
        current_hand_p1: p1_cur_hand_list,
        current_hand_p2: p2_cur_hand_list,
        current_time: battle_time,
        current_mana_p1: p1_mana,
        current_mana_p2: p2_mana
    }

    /* Broadcast message through these connection channel */
    io.in('room-'+player1+player2).emit('raw',json_obj);

    // Record the battle command in battle_recording
    if(battle_recording[player1+player2] == undefined){
        console.log("[io.render][Error] Haven't has any players summon this battle room yet!");
        // Build a room for this pair
        let create_time = moment().format('YYYY-MM-DD-hh-mm-ss-a');
        battle_room[player1+player2] = create_time;
        var record_data = {
            content:[]
        };
        record_data.content.push(json_obj);
        battle_recording[player1+player2] = record_data;
        
        console.log('[io.render][Create Battle Room] Player 1: ' + player1 +"; Player 2:" + player2);
        res.end("Open room for user (which doesn't open an room for it)");
    }
    else{
        battle_recording[player1+player2].content.push(json_obj);
        res.end("OK , command send");
    }
})

// Post method of end command
app.post('/game_end', function(req,res){
    var player1 = req.body.p1;
    var player2 = req.body.p2;
    console.log('[io.render][End of Battle] Player1:' + player1+" , Player 2:"+player2+ ".");
    // Cancel from room
    var battle_t = battle_room[player1+player2];
    battle_room[player1+player2] = undefined;
    // Break down the channel , inform by server
    var end_match = {
        winner: req.body.winner,
        tower_p1_take: req.body.p1_destroy,
        tower_p2_take: req.body.p2_destroy
    }
    io.in('room-'+player1+player2).emit('EOG',end_match);
    // Write record into file
    var record_obj = battle_recording[player1+player2];
    // Change file name to available one when all data had been written
    jsfs.writeFile(battle_record_storage+'/'+battle_t+'_'+player1+'_'+player2,record_obj,function(err){
        if(err) {
            console.log('[io.render][I/O Error] Battle log writing failed , log_Name : ' + battle_t+'_'+player1+'_'+player2);
            // FIXME : Storage failed list => to recovery
            return;
        }
        /* When we finish log file,change this file name */
        fs.rename(battle_record_storage+'/'+battle_t+'_'+player1+'_'+player2,battle_record_storage+'/'+battle_t+'_'+player1+'_'+player2+'_'+req.body.winner+'_.battlelog',function(err_rename){
            if(err_rename){
                // Rename failure
                console.log('[io.render][I/O Error] Battle log renaming failed , log_Name : ' + battle_t+'_'+player1+'_'+player2);
                // FIXME : Storage failed list => to recovery
                return;
            }
        });
    });
    // send end command
    res.end('OK');
    // Release the battle recording buffer
    battle_recording[player1+player2] = undefined;
});

// Listen url request
if(process.env.TRAVIS != "true"){
    server.listen(process.env.npm_package_config_portiorender, function(){
        var host = server.address().address;
        var port = server.address().port;
        // logger.record('io.render',"[io.render] Example app listening at "+host+" : "+port);
        console.log("[io.render] io.render server listening at "+host+" : "+port);
    });

    // Render channel
    io.sockets.on('connection',function(socket){
        socket.on("join",function(room_info){
            console.log('[io.render] Join Room request send from : ' + socket.request.connection.remoteAddress+" ; With Room ID :" + room_info.room_name);
            socket.room = room_info.room_name;
            socket.join('room-'+room_info.room_name);
            // Enroll socket channel
            var channel_obj = {
                tag: room_info.room_name,
                ip: socket.request.connection.remoteAddress,
                p1: room_info.p1,
                p2: room_info.p2,
                timestamp: battle_room[room_info.room_name]
            };
            // Push it into socket_channel
            socket_channel.push(channel_obj);
        });
        socket.on("disconnect",function(){
            console.log('[io.render] Disconnect from ' + socket.request.connection.remoteAddress);
            socket.leave('room-'+socket.room);
            // Enroll socket channel
            for(var index in socket_channel){
                if(socket_channel[index].ip == socket.request.connection.remoteAddress && socket_channel[index].tag == socket.room){
                    socket_channel.splice(index,1);
                }
            }
        });
    });

    // =============================================== Control io here ===============================================
    var control_io = new IO().listen(process.env.npm_package_config_portcontrol);

    // Making an information center
    control_io.sockets.on('connection', function (socket) {
        // ====================================== Dealing with the user input ======================================
        socket.on('control',function(data){
            console.log("[Information Server] Successfully Build manually connection from :" + socket.request.connection.remoteAddress);
            console.dir(data);
            // Deliver the message to Mock AI
            control_io.in('room-'+data.owner).emit('cmd',data);
        });
        // ( User input ) Disconnect Event
        socket.on('disconnect',function(){
            console.log("[Information Server] Control channel deprecate from : " + socket.request.connection.remoteAddress);
        })

        // ====================================== Dealing with Mock AI operation ======================================
        socket.on('fetch_room',function(data){
            /* Using room to connect with mock AI */
            console.log("[Information Server] Mock AI join room: " + data.mock_id);
            socket.join('room-'+data.mock_id);
        });
        // ( Mock AI ) Disconnect Event - leaving room
        socket.on('release',function(data){
            console.log("[Information Server] Mock AI: "+data.mock_id+" leave room.")
            socket.leave('room-'+data.mock_id);
        });
    });
}
