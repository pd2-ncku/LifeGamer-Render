/* Global variable */
// Maintain all minions in queue
var minion = [];
var buildings = [];
// Scene Part
var wrapper = new PIXI.Container();
var main_stage = new PIXI.Container();
var close_stage = new PIXI.Container();
wrapper.addChild(close_stage);
wrapper.addChild(main_stage);
close_stage.alpha = 0;
// Render part
var size_adapter = document.getElementById('arena');
var renderer = PIXI.autoDetectRenderer(size_adapter.offsetWidth,size_adapter.offsetHeight);
renderer.backgroundColor = 0x1099bb;
// Close stage
var font_style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: size_adapter.offsetWidth
});
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
// sound effect
var opening = new Howl({
    src: ['game_start.mp3'],
    loop: false
});
opening.play();
var bg = new Howl({
    src: ['bg_sound_track1.mp3'],
    loop: true
});
bg.play();
var eog = new Howl({
    src: ['endofgame.mp3'],
    loop: false
});
/* Connection establish */
const socket = io();
// Send join to server
var room_name = document.getElementById('room_name').value;
socket.emit('join',room_name);
// disconnect from server
window.addEventListener("beforeunload", function(e){
    socket.emit('disconnect');
}, false);

var command_buffer = [];
// Command/Data receive
socket.on('raw',function(data){
    /* Receive the message and parse it */
    var raw_data = data;
    command_buffer.push(raw_data);
});

socket.on('replay',function(data){
    /* Replay log receive */
    var record = data.content;
    var index = 0;
    var command_push_rate = 1000;
    /* And then push those command in verify tick */
    var command_pusher = setInterval(function(){
        if(index >= record.length){
            clearInterval(command_pusher);
        }
        else{
            command_parser(record[index]);
            index++;
        }
    },command_push_rate);
});

// Dealing with interaction
socket.on('EOG',function(battle_info){
    // FIXME : dealing with final state (and show the result page)
    // And break down channel
    console.log("End of Game received! Hope you enjoy this game!");
    // bg fade out
    bg.fade(1.0,0.0,1000);
    eog.play();
    socket.emit('disconnect');
    // setup close_stage
    var endText = new PIXI.Text('Thank for playing !\nAnd Congratulate winner :'+ battle_info.winner, font_style);
    endText.x = (size_adapter.offsetWidth - endText.width)/2;
    endText.y = (size_adapter.offsetHeight - endText.height)/2;
    close_stage.addChild(endText);
    state = closegame;
});

// Set an Interval to deliver
var tick_simulation = setInterval(function(){
    var latest_cmd;
    if(command_buffer.length > 0){
        // Pop out the first command from command buffer
        latest_cmd = command_buffer.shift();
        command_parser(latest_cmd);
    }
},100);


function command_parser(cmd_obj){
    /* Get current type of message */
    var cmd_type = cmd_obj.cmd;
    var current_minion_list = cmd_obj.current_minion;
    var new_minion_list = cmd_obj.new_minion;
    var tower_list = cmd_obj.buildings;
    if(cmd_type == "battle"){
        /* Battle field Ongoing */
        if(current_minion_list.length > 0 ){
            /* Do new checking */
            if(minion.length == 0){
                /* TODO Notice that this user need to replot the battle field */
                // Using for loop instead of forEach
                for(var index in current_minion_list){
                    // FIXME: using add_minion here, and create "recover detection"
                    var current_minion = current_minion_list[index];
                    add_minion(current_minion.belong,current_minion.name,current_minion.type,current_minion.status,current_minion.move,current_minion.loc_x,current_minion.loc_y);
                }
            }
            else{
                /* Control those minion */
                for(var index in current_minion_list){
                    var current_minion = current_minion_list[index];
                    control_minion(current_minion.name,current_minion.status,current_minion.move,current_minion.loc_x,current_minion.loc_y);
                }
            }
        }
        if(new_minion_list.length > 0){
            /* Add new minion */
            for(var index in new_minion_list){
                var new_minion = new_minion_list[index];
                add_minion(new_minion.belong,new_minion.name,new_minion.type,100,new_minion.move,new_minion.loc_x,new_minion.loc_y);
            }
        }
        if(tower_list.length > 0){
            // Dealing with buildings
            for(var index in tower_list){
                var tower = tower_list[index];
                control_building(tower.name,tower.status);
            }
        }
    }
}

function control_building(tower_name,tower_status){
    for(var index in buildings){
        if(buildings[index].object_No == tower_name){
            buildings[index].set_status(tower_status);
            if(Math.floor(buildings[index].hp.outer.width) <= 0){
                // Remove this object from the battle field
                buildings[index].destroy();
                main_stage.removeChild(buildings[index].obj);
                main_stage.removeChild(buildings[index].hp);
                buildings.splice(index,1);
                // FIXME : or show ruins on the tower location
            }
        }
    }
}

function control_minion(obj_name,status,direction,loc_x,loc_y){
    for(var index in minion){
        if(minion[index].object_No == obj_name){
            // Remove this minion from the battle field
            console.log("Before-> Minion HP: " + minion[index].hp.outer.width);
            minion[index].set_status(status);
            console.log("After-> Minion HP: " + minion[index].hp.outer.width);
            if(Math.floor(minion[index].hp.outer.width) <= 2){
                // Remove this object from battle field
                main_stage.removeChild(minion[index].obj);
                main_stage.removeChild(minion[index].hp);
                minion[index].kill();
                minion.splice(index,1);
            }
            else{
                // Using loc_x and loc_y to set current minion direction
                minion[index].set_loc_by_xy(loc_x,loc_y,parseInt(direction));
            }
        }
    }
}

function add_minion(belong,name,type,status,direction,loc_x,loc_y){
    /* Merge Recover in here */
    if(parseInt(status) <= 0){
        // this minion no need to recover
    }
    else {
        var unit_pieces = 100;
        switch (type) {
            // Siege devices
            case 'sgram':
                /* Summon new sgram car */
                var sgram = new SGRAM(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                sgram.change_direction(parseInt(direction));
                sgram.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                sgram.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                main_stage.addChild(sgram.obj);
                main_stage.addChild(sgram.hp);
                minion.push(sgram);
                break;
            // Elf force
            case 'elf_archer':
                var elf_archer = new ELF_ARCHER(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                elf_archer.change_direction(parseInt(direction));
                elf_archer.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                elf_archer.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                main_stage.addChild(elf_archer.obj);
                main_stage.addChild(elf_archer.hp);
                minion.push(elf_archer);
                break;
            case 'elf_wisp':
                var elf_wisp = new ELF_WISP(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                elf_wisp.change_direction(parseInt(direction));
                elf_wisp.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                elf_wisp.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                main_stage.addChild(elf_wisp.obj);
                main_stage.addChild(elf_wisp.hp);
                minion.push(elf_wisp);
                break;
            case 'elf_giant':
                var elf_giant = new ELF_ROCK_GIANT(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                elf_giant.change_direction(parseInt(direction));
                elf_giant.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                elf_giant.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                main_stage.addChild(elf_giant.obj);
                main_stage.addChild(elf_giant.hp);
                minion.push(elf_giant);
                break;
            // Human force
            case 'human_thief':
                var human_thief = new HUMAN_THIEF(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                human_thief.change_direction(parseInt(direction));
                human_thief.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                human_thief.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                main_stage.addChild(human_thief.obj);
                main_stage.addChild(human_thief.hp);
                minion.push(human_thief);
                break;
            case 'human_knight':
                var human_knight = new HUMAN_KNIGHT(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                human_knight.change_direction(parseInt(direction));
                human_knight.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                human_knight.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                main_stage.addChild(human_knight.obj);
                main_stage.addChild(human_knight.hp);
                minion.push(human_knight);
            break;
            case 'human_priest':
                var human_priest = new HUMAN_PRIEST(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                human_priest.change_direction(parseInt(direction));
                human_priest.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                human_priest.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                main_stage.addChild(human_priest.obj);
                main_stage.addChild(human_priest.hp);
                minion.push(human_priest);
            break;
            // Undead force
            case 'undead_samurai':
                var undead_samurai = new UNDEAD_SAMURAI(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                undead_samurai.change_direction(parseInt(direction));
                undead_samurai.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                undead_samurai.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                main_stage.addChild(undead_samurai.obj);
                main_stage.addChild(undead_samurai.hp);
                minion.push(undead_samurai);
            break;

            default:

        }
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
        "battle_field/water_texture.png",
        "buildings/castle-blue.png",
        "buildings/castle-red.png",
        "buildings/big_castle.png"
    ])
    .add([
        "minion/elf/elf_rock_giant.png",
        "minion/elf/elf_wisp.png",
        "minion/elf/elf_archer.png",
        "minion/elf/elf_rock_giant_p2.png",
        "minion/elf/elf_wisp_p2.png",
        "minion/elf/elf_archer_p2.png",
    ])
    .add([
        "minion/human/human_priest.png",
        "minion/human/human_knight.png",
        "minion/human/human_priest_p2.png",
        "minion/human/human_knight_p2.png",
        "minion/human/human_thief.png",
        "minion/human/human_thief_p2.png"
    ])
    .add([
        "minion/siege/sgram.png",
        "minion/siege/sgram_p2.png"
    ])
    .add([
        "minion/undead/undead_samurai.png",
        "minion/undead/undead_samurai_p2.png"
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

    // setting tower
    var x_bound = 7;
    var main_x_bound = 2;
    var p1_vicetower_top = new CASTLE(vice_tower_unit*x_unit,vice_tower_unit*y_unit,'p1_top','p1');
    p1_vicetower_top.setpos(x_bound*x_unit,2*y_unit);
    var p1_vicetower_down = new CASTLE(vice_tower_unit*x_unit,vice_tower_unit*y_unit,'p1_down','p1');
    p1_vicetower_down.setpos(x_bound*x_unit,14*y_unit);
    var p1_maintower = new BIG_CASTLE(main_tower_unit*x_unit,main_tower_unit*y_unit,'p1_main','p1');
    p1_maintower.setpos((main_x_bound)*x_unit,7*y_unit);
    var p2_vicetower_top = new CASTLE(vice_tower_unit*x_unit,vice_tower_unit*y_unit,'p2_top','p2');
    p2_vicetower_top.setpos((50-x_bound-vice_tower_unit)*x_unit,2*y_unit);
    var p2_vicetower_down = new CASTLE(vice_tower_unit*x_unit,vice_tower_unit*y_unit,'p2_down','p2');
    p2_vicetower_down.setpos((50-x_bound-vice_tower_unit)*x_unit,14*y_unit);
    var p2_maintower = new BIG_CASTLE(main_tower_unit*x_unit,main_tower_unit*y_unit,'p2_main','p2');
    p2_maintower.setpos((50-main_x_bound-main_tower_unit)*x_unit,7*y_unit);

    // add them into scene
    main_stage.addChild(ground);
    main_stage.addChild(river);
    main_stage.addChild(bridge_top);
    main_stage.addChild(bridge_down);
    main_stage.addChild(p1_vicetower_top.obj);
    main_stage.addChild(p1_vicetower_top.hp);
    main_stage.addChild(p1_vicetower_down.obj);
    main_stage.addChild(p1_vicetower_down.hp);
    main_stage.addChild(p1_maintower.obj);
    main_stage.addChild(p1_maintower.hp);
    main_stage.addChild(p2_vicetower_top.obj);
    main_stage.addChild(p2_vicetower_top.hp);
    main_stage.addChild(p2_vicetower_down.obj);
    main_stage.addChild(p2_vicetower_down.hp);
    main_stage.addChild(p2_maintower.obj);
    main_stage.addChild(p2_maintower.hp);

    // set sprite's location
    ground.position.set(0,0);
    river.position.set(22*x_unit,0);
    bridge_top.position.set(22*x_unit,3*y_unit);
    bridge_down.position.set(22*x_unit,13*y_unit);

    // Push tower into buildings array
    buildings.push(p1_vicetower_top);
    buildings.push(p1_vicetower_down);
    buildings.push(p2_vicetower_top);
    buildings.push(p2_vicetower_down);
    buildings.push(p1_maintower);
    buildings.push(p2_maintower);

    battle_gameLoop();
}

state = play;
function battle_gameLoop(){
    requestAnimationFrame(battle_gameLoop);
    state();
    renderer.render(wrapper);
}

function play(){
    /* Receive the message and summon our minion here */
    // And moving the Character
    for(var index in minion){
        // Using 0,1 to control minion moving mechanism
        minion[index].move(0);
        minion[index].check_boundary();
    }
}

function closegame(){
    if( Math.floor(main_stage.alpha) >= 0){
        // Open close stage
        main_stage.alpha -= 0.01;
        close_stage.alpha += 0.01;
    }
}

var tick = 0;
setInterval(function() {
    for(var index in minion){
        minion[index].walking(tick);
    }
    for(var b_index in buildings){
        buildings[b_index].progressing(tick);
    }
    tick++;
}, 100);
