const io = require('socket.io');

module.exports = {
    player_channel: function(denote,main_server){
        this.io_render = io.listen(main_server);
        this.nsp = this.io_render.of("/"+denote);
        this.nsp.on('connection',function(socket){
            console.log('[io.render] New Connection from ' + socket.request.connection.remoteAddress);
            var update = setInterval(function() {
                // When command receive from target source , emit command to client to update status
                socket.emit('raw', {
                	'cmd': "hi"+denote
                });
            }, 1000);
        });
    }
};
