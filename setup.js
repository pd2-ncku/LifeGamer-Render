/* get config.json to setup this program */
const fs = require('fs');
const jsfs = require('jsonfile');

const config = jsfs.readFileSync(__dirname+"/config.json");

/* Define storage path here */
var server_battle_record = "";

/* Build server root */
console.log("[io.render] Current platform of io.render server : "+process.platform);
if(process.platform == "win32"){
    // if run on Windows, using current directory as storage
    /* Build essential record storage place */
    if(!fs.existsSync(__dirname +'/'+ config.server_root)){
        fs.mkdirSync(__dirname +'/'+ config.server_root);
    }
    server_battle_record = __dirname +'/'+ config.server_root +'/'+ config.server_battle_record;
}
else if(process.platform == "linux"){
    // if run on Linux, using /tmp
    if(!fs.existsSync( '/tmp/'+ config.server_root)){
        fs.mkdirSync( '/tmp/'+ config.server_root);
    }
    server_battle_record = '/tmp' + '/' + config.server_root + '/' + config.server_battle_record;
}

/* Build essential record storage place */
if(!fs.existsSync(server_battle_record)){
    fs.mkdirSync(server_battle_record);
}
