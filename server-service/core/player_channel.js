/*
    Maintain Each user's communicate channel
    player_channel : constructor
    setup : setup connection
    get_cmd : get and receive new command , and then open writable flag to let socket send
    find : compare whether is target channel or not
*/

function player_channel(p1,p2,main_server,moment,address){
    // Construct object
    var Server = require('socket.io');
    this.io = new Server();
    this.own_denote = p1+p2;
    this.player1 = p1;
    this.player2 = p2;
    this.io_render = this.io.listen(main_server);
    this.connection_address = address;
    this.cmd = null;
    this.active = true;
    this.init_time = moment;
    this.writeable = 1;
};

player_channel.prototype.setup = function(){
    var self = this;
    self.io_render.on('connection',function(socket){
        socket.join('room-'+self.own_denote);
        var update = setInterval(function(){
            switch (self.writeable) {
                case 1:
                    self.io_render.in('room-'+self.own_denote).emit('raw',self.cmd);
                    self.writeable = 0;
                    break;
                case 2:
                    self.io_render.in('room-'+self.own_denote).emit('replay',self.cmd);
                    self.writeable = 0;
                    break;
                default:

            }
        },1);
        socket.on("disconnect",function(){
            console.log('[io.render] Disconnect from ' + socket.request.connection.remoteAddress);
            // Set this channel to false , waiting to be delete
            self.active = false;
            socket.leave('room-'+self.own_denote);
        });
    });
}

player_channel.prototype.get_cmd = function(cmd){
    this.cmd = cmd;
    this.writeable = 1;
}

player_channel.prototype.get_replay = function(replay_log){
    this.cmd = replay_log;
    this.writeable = 2;
}

player_channel.prototype.find = function(denote){
    if(this.own_denote == denote){
        return true;
    }
    return false;
}

module.exports = player_channel;
