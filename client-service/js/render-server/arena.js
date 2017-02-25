/* Global variable */
// Maintain all minions in queue
var minion = [];
// Scene Part
var main_stage = new PIXI.Container();
// Render part
var size_adapter = document.getElementById('arena');
var renderer = PIXI.autoDetectRenderer(size_adapter.offsetWidth,size_adapter.offsetHeight);
/* Battle field Initialize */
// Setup Game Frame Measurement
const max_w = size_adapter.offsetWidth;
const max_h = size_adapter.offsetHeight;
const map_w_unit = 50;
const map_h_unit = 20;
const x_unit = max_w/map_w_unit;
const y_unit = max_h/map_h_unit;

// Battle field Background variable
const river_w_unit = 6;
const river_h_unit = 20;
const bridge_w_unit = 6;
const bridge_h_unit = 4;

// Fundamental structure ( cube )
const main_tower_unit = 6;
const vice_tower_unit = 4;

console.log("Arena Size: (" + max_w + "," + max_h + ")");
console.log("Per unit size: x=" + x_unit + ", y=" + y_unit);

// Command prototype
var cmd_prototype = {
    'cmd': 'battle',
    'current_minion' : [
        {
            'name': 'orge1',
            'type': 'orge',
            'status': '50',
            'move': '2',
            'loc_x': '20',
            'loc_y': '10'
        }
    ] ,
    'new_minion': [
        {
            'name': 'orge1',
            'type': 'orge',
            'move': '1',
            'loc_x': '30',
            'loc_y': '10'
        }
    ]
}
console.log(JSON.stringify(cmd_prototype));

/* Connection establish */
const socket = io();
// disconnect from server
window.addEventListener("beforeunload", function(e){
    socket.emit('disconnect');
}, false);
// Command/Data receive
socket.on('raw',function(data){
    /* Receive the message and parse it */
    var raw_data = data;
    command_parser(raw_data);
});

socket.on('replay',function(data){
    /* Replay log receive */
    var record = data.content;
    var index = 0;
    /* And then push those command in verify tick */
    var command_pusher = setInterval(function(){
        if(index >= record.length){
            clearInterval(command_pusher);
        }
        else{
            command_parser(record[index]);
            index++;
        }
    },1000);
});

function command_parser(cmd_obj){
    /* Get current type of message */
    var cmd_type = cmd_obj.cmd;
    var current_minion_list = cmd_obj.current_minion;
    var new_minion_list = cmd_obj.new_minion;
    if(cmd_type == "battle"){
        /* Battle field Ongoing */
        if(current_minion_list.length > 0 ){
            /* Do new checking */
            if(minion.length == 0){
                /* TODO Notice that this user need to replot the battle field */
                current_minion_list.forEach(function(current_minion){
                    recover_minion(current_minion.name,current_minion.type,current_minion.status,current_minion.move,current_minion.loc_x,current_minion.loc_y);
                });
            }
            else{
                /* Control those minion */
                current_minion_list.forEach(function(current_minion){
                    control_minion(current_minion.name,current_minion.status,current_minion.move);
                });
            }
        }
        if(new_minion_list.length > 0){
            /* Add new minion */
            new_minion_list.forEach(function(new_minion){
                add_minion(new_minion.name,new_minion.type,new_minion.move,new_minion.loc_x,new_minion.loc_y);
            });
        }
    }
}

function recover_minion(name,type,status,direction,loc_x,loc_y){
    switch (type) {
        case 'orge':
            if(parseInt(status) <= 0){
                // this minion no need to recover
            }
            else{
                /* Resummon orge minion */
                var orge = new ORGE(x_unit,y_unit,name,max_w,max_h);
                orge.change_direction(parseInt(direction));
                /* loc_x and loc_y => (x,y) => need to convert one time */
                orge.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                orge.set_status(status);
                main_stage.addChild(orge.obj);
                main_stage.addChild(orge.hp);
                minion.push(orge);
            }
            break;
        case 'mage':
            if(parseInt(status) <= 0){
                // this minion no need to recover
            }
            else {
                /* Resummon mage minion */
                var mage = new MAGE(x_unit,y_unit,name,max_w,max_h);
                mage.change_direction(parseInt(direction));
                /* loc_x and loc_y => (x,y) => need to convert one time */
                mage.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                mage.set_status(status);
                main_stage.addChild(mage.obj);
                main_stage.addChild(mage.hp);
                minion.push(orge);
            }

            break;
        default:

    }
}

function control_minion(obj_name,status,direction){
    minion.forEach(function(each_minion,index,object){
        if(each_minion.object_No == obj_name){
            /* add status - using percentage , which is negative */
            // Remove this minion from the battle field
            each_minion.set_status(parseInt(status));
            if(each_minion.hp.outer.width <= 0){
                // Remove this object from battle field
                main_stage.removeChild(each_minion.obj);
                main_stage.removeChild(each_minion.hp);
                each_minion.kill();
                object.splice(index,1);
            }
            else{
                each_minion.change_direction(parseInt(direction));
            }
        }
    })
}

function add_minion(name,type,direction,loc_x,loc_y){
    switch (type) {
        case 'orge':
            /* Summon new orge minion */
            var orge = new ORGE(x_unit,y_unit,name,max_w,max_h);
            orge.change_direction(parseInt(direction));
            orge.set_basicV(x_unit/30,y_unit/30);
            /* loc_x and loc_y => (x,y) => need to convert one time */
            orge.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
            main_stage.addChild(orge.obj);
            main_stage.addChild(orge.hp);
            minion.push(orge);
            break;
        case 'mage':
            /* Summon new orge minion */
            var mage = new MAGE(x_unit,y_unit,name,max_w,max_h);
            mage.change_direction(parseInt(direction));
            mage.set_basicV(x_unit/45,y_unit/45);
            mage.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
            main_stage.addChild(mage.obj);
            main_stage.addChild(mage.hp);
            minion.push(mage);
            break;
        default:

    }
}

// Append render view into DOM tree
document.getElementById("arena").appendChild(renderer.view);

/* Loading Arena Texture */
PIXI.loader
    .add([
        "battle_field/bridge_texture.png",
        "battle_field/house_texture.png",
        "battle_field/land_texture.png",
        "battle_field/water_texture.png"
    ])
    .add([
        "minion/orge.png",
        "minion/mage.png"
    ])
    .on("progress", loadProgressHandler)
    .load(setup);

// Setting Global object (Sprite)
var ground;
var bridge_top;
var bridge_down;
var river;

// Show Loading (Waiting) Message
function loadProgressHandler(loader, resource) {
    //Display the file `url` currently being loaded
    console.log("loading: " + resource.url);
    //Display the precentage of files currently loaded
    console.log("progress: " + loader.progress + "%");
}

// Setup render page
function setup() {
    // setup battle field
    ground = new PIXI.Sprite(
	       PIXI.loader.resources["battle_field/land_texture.png"].texture
	);
    bridge_top = new PIXI.Sprite(
	       new PIXI.Texture(PIXI.BaseTexture.fromImage("battle_field/bridge_texture.png"))
	);
    bridge_down = new PIXI.Sprite(
	       new PIXI.Texture(PIXI.BaseTexture.fromImage("battle_field/bridge_texture.png"))
	);
    river = new PIXI.Sprite(
	       PIXI.loader.resources["battle_field/water_texture.png"].texture
	);

    // set size
    ground.width = max_w;
    ground.height = max_h;
    bridge_top.width = 6 * x_unit;
    bridge_top.height = 4 * y_unit;
    bridge_down.width = 6 * x_unit;
    bridge_down.height = 4 * y_unit;
    river.width = 6 * x_unit;
    river.height = max_h;

    // add them into scene
    main_stage.addChild(ground);
    main_stage.addChild(river);
    main_stage.addChild(bridge_top);
    main_stage.addChild(bridge_down);

    // set sprite's location
    ground.position.set(0,0);
    river.position.set(22*x_unit,0);
    bridge_top.position.set(22*x_unit,3*y_unit);
    bridge_down.position.set(22*x_unit,13*y_unit);

    battle_gameLoop();
}

state = play;
function battle_gameLoop(){
    requestAnimationFrame(battle_gameLoop);
    state();
    renderer.render(main_stage);
}

function play(){
    /* Receive the message and summon our minion here */
    // And moving the Character
    minion.forEach(function(each_mini){
		each_mini.move();
        each_mini.check_boundary();
	});
}

var tick = 0;
setInterval(function() {
	minion.forEach(function(each_mini){
        //each_mini.set_status(-1);
		each_mini.walking(tick);
	});
    tick++;
}, 100);
