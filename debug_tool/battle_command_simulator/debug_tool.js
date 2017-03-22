/* Using request to do the trick.
    Making http post request to send battle command.
    Automatically send the commands , which fetch from the script we set.
    Can Test the io.render server quickly without using postman manully.
*/
const readline = require('readline');
const request = require('request');
const jsfs = require('jsonfile');
const shell = require('./shell');
const fs = require('fs');

/* Construct readline */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "debug_tool@cmd_shell> "
})

var config = '';
var cmd_script = '';

console.log("Debug-tool %s is open:",process.env.npm_package_config_version);
console.log("\nYou can using \"send_script\" to deliver the script you have set.\n");
rl.prompt();

// Create debug tool shell
rl.on('line',(input)=>{
    // fetch config from specific setting
    if(fs.existsSync(__dirname+'/config.json')){
        var config = jsfs.readFileSync(__dirname+'/config.json');
    }
    else {
        console.log('Can\'t read config. Please put your setting into file which named "config.json" in current directory.');
        return;
    }
    // fetch data content from script
    if(fs.existsSync(__dirname+'/cmd_script.json')){
        var cmd_script = jsfs.readFileSync(__dirname+'/cmd_script.json');
    }
    else {
        console.log('Can\'t read config. Please put your setting into file which named "cmd_script.json" in current directory.');
        return;
    }
    console.log("successfully loading !");
    /* First go the shell.js to parse the command */
    shell.cmd_handler(input,cmd_script,config,request,rl);
    rl.prompt();
}).on('close',()=>{
    /* When user want to close this small terminal */
    console.log('\nThank for using debug-tool!\n');
    process.exit(0);
});
