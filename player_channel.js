/*
    Maintain Each user's communicate channel
    player_channel : constructor
    setup : setup connection
    get_cmd : get and receive new command , and then open writable flag to let socket send
    find : compare whether is target channel or not
*/

function player_channel(p1,p2,main_server,channel_obj){
    // Construct object
    var Server = require('socket.io');
    this.io = new Server();
    this.own_denote = p1+p2;
    this.player1 = p1;
    this.player2 = p2;
    this.io_render = this.io.listen(main_server);
    this.cmd = null;
    this.writeable = 1;
    this.active = true;
    this.nsp = this.io_render.of("/"+p1+p2);
};

player_channel.prototype.setup = function(){
    var self = this;
    self.nsp.on('connection',function(socket){
        console.log('[io.render] New Connection from ' + socket.request.connection.remoteAddress);
        var update = setInterval(function(){
            if(self.writeable == 1){
                socket.emit('raw', self.cmd );
                self.writeable = 0;
            }
        },10);
        socket.on("disconnect",function(){
            console.log('[io.render] Disconnect from ' + socket.request.connection.remoteAddress);
            self.active = false;
            socket.disconnect();
        });
    });
}

player_channel.prototype.get_cmd = function(cmd){
    this.cmd = cmd;
    this.writeable = 1;
}

player_channel.prototype.find = function(denote){
    if(this.own_denote == denote){
        return true;
    }
    return false;
}

module.exports = player_channel;
