/**
 * Dealing with user manually control
 */
var CONTROL_CHANNEL = function(){
    // Create io for connection usage
    this.m_port = document.getElementById('control_port').value;
    this.owner = document.getElementById('c_player').value;
    this.control_socket = io.connect(window.location.hostname+":"+this.m_port);
}

CONTROL_CHANNEL.prototype.place_minion = function(belong,type,x,y){
    this.control_socket.emit('control',{
        belong: belong,
        owner: this.owner,
        type: type,
        loc_x: x,
        loc_y: y
    });
}

CONTROL_CHANNEL.prototype.disconnect = function(){
    this.control_socket.emit('disconnect');
}
