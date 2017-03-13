/* get config.json to setup this program */
const fs = require('fs');
const jsfs = require('jsonfile');

const config = jsfs.readFileSync(__dirname+"/config.json");

var server_battle_record = __dirname +'/'+ config.server_root +'/'+ config.server_battle_record;

/* Build essential record storage place */
if(!fs.existsSync(server_battle_record)){
    fs.mkdirSync(server_battle_record);
}
