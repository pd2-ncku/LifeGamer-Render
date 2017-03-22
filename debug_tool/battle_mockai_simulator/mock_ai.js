/* Our mock ai simulation */
/* Using socket.io-client as connection tool */
/**
*   @constructor
*/
const socket = require('socket.io-client')('http://localhost:3002');
// ================================== At first , we go to information server to require our channl room ================================== //
// FIXME: assume using pass by parameter to setup mock id
socket.emit('fetch_room',{
    mock_id: process.argv[2]
});
/**
*   emit the require message to information center (to let this socket join the room!) => need one time
*   connect to localhost:3002 ! (or using package.json to maintain the node)
*   using "parameter" to initialize who "own" this mock AI
*/

/**
*   Main Program here:
*   function that get message from information center !
*   @data
*   Using "console.log" as stdout (don't need to read `stdin`)
*/
socket.on('cmd',function(data){
    // FIXME: Parsing the msg
    console.log("Get message from : ");
    console.dir(data);
});
