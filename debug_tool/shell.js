/* Use to parse the command from main */

/* Shell - parsing command */
function cmd_handler(cmd,deliver_cmd_script,config,request){
    switch(cmd.trim()){
        case 'help':
            /* Show error message */
            console.log("usage : \n");
            console.log("\thelp: list out the usage information.");
            console.log("\texit: exit this service.");
            console.log("");
        break;
        case 'exit':
            console.log("\nThank for using debug-tool!\n");
            process.exit(0);
        break;
        case 'send_script':
            console.log("\nDeliver the cmd_script !\n");
            delivery_script(deliver_cmd_script,config,request);
        break;
        case 'send_cmd':
            /* TODO : Send command manually */
        break;
        default:
        break;
    }
}

// function of delivery: Deliver to target
function delivery_script(cmd_script,config,request){
    cmd_script.content.forEach(function(each_cmd){
        // console.dir(cmd);
        setTimeout(function(){
            request.post(config.target+":"+config.port+config.pathname, {
                form:{
                    cmd: each_cmd.cmd,
                    p1: config.p1,
                    p2: config.p2,
                    current_minion: JSON.stringify(each_cmd.current_minion),
                    new_minion: JSON.stringify(each_cmd.new_minion),
                    buildings: JSON.stringify(each_cmd.buildings)
                }
            });
        },parseInt(config.interval));
    });
}

exports.cmd_handler = cmd_handler;
