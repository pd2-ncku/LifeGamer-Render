// Provide data visualization work of replay log.
const fs = require('fs');
const path = require('path');
const jsfs = require('jsonfile');
/* core */
const config = jsfs.readFileSync(path.join(__dirname,"..","config.json"));
var battle_record_storage;
/* Base on platform to decide storage path */
if(process.platform == "win32"){
    // if run on Windows, using current directory as storage
    battle_record_storage = __dirname + '/' + config.server_root + '/' + config.server_battle_record;
}
else if(process.platform == "linux"){
    // if run on Linux, using /tmp
    battle_record_storage = '/tmp/' + config.server_root + '/' + config.server_battle_record;
}


// definition here
class DataVisual {
    init(app){
        app.get('/dv',this.dv);
    }
    dv(req,res){
        // Fetch data from log storage
        fs.readdir(battle_record_storage,function(err,files){
            if(err){
                console.log("[io.render][DataVisual][Error readdir] : " + battle_record_storage);
            }
            else {
                /* Render choosing page */
                res.render('datavisual_battle_frequency',{
                    title: 'Data visualization Page',
                    content: files
                });
            }
        });
    }
}

module.exports = {
    DataVisual: new DataVisual()
};
