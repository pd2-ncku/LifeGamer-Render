/* Use to parse the command from main */

/* Shell - parsing command */
function cmd_handler(cmd,deliver_cmd_script,config,request,readline){
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
            delivery_script(deliver_cmd_script,config,request,readline);
        break;
        case 'send_end':
            console.log("\nDeliver the ending command !\n");
            end_script(config,request);
        break;
        case 'send_cmd':
            /* TODO : Send command manually */
        break;
        default:
        break;
    }
}

// function of delivery: Deliver to target
function delivery_script(cmd_script,config,request,readline){
    var index = 0;
    var update = setInterval(function(){
        if(index < cmd_script.content.length){
            // send
            console.log("Next command , No."+index);
            request.post(config.target+":"+config.port+config.pathname, {
                form:{
                    cmd: cmd_script.content[index].cmd,
                    p1: config.p1,
                    p2: config.p2,
                    current_minion: JSON.stringify(cmd_script.content[index].current_minion),
                    new_minion: JSON.stringify(cmd_script.content[index].new_minion),
                    buildings: JSON.stringify(cmd_script.content[index].buildings)
                }
            });
            index++;
        }
        else{
            clearInterval(update);
            readline.prompt();
        }
    },1000);
}

// end command
function end_script(config,request){
    request.post(config.target+":"+config.port+config.end, {
        form:{
            p1: config.p1,
            p2: config.p2
        }
    });
}

exports.cmd_handler = cmd_handler;
