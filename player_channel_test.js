function Channel(denote , main_server){
    var object = {};
    object.init_channel = function(denote , main_server){
        this.io = require('socket.io');
        this.own_denote = denote;
        this.io_render = this.io.listen(main_server);
        this.cmd = cmd;
        this.nsp = this.io_render.of("/"+denote);
        this.nsp.on('connection',function(socket){
            console.log('[io.render] New Connection from ' + socket.request.connection.remoteAddress);
            var update = setInterval(function () {
                socket.emit('raw', {
                    'cmd': this.cmd
                });
            }, 1000);
        });
    }
    object.get_cmd = function(cmd){
        this.cmd = cmd;
    }
    object.find = function(denote){
        if(this.own_denote == denote){
            return true;
        }
        else{
            return false;
        }
    }

    return object;
}

module.exports = Channel;
