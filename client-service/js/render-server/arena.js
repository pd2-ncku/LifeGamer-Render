/* Connection establish */
var est = document.getElementById('socket.io.nsp').value;
const socket = io(est);
socket.on('raw',function(data){
    console.log(data);
});
/* Battle field Initialize */
// Scene Part
var main_stage = new PIXI.Container();
// Render part
var size_adapter = document.getElementById('arena');
var renderer = PIXI.autoDetectRenderer(size_adapter.offsetWidth,size_adapter.offsetHeight);
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
        "minion/orge.png"
    ])
    .on("progress", loadProgressHandler)
    .load(setup);

// Setting Global object (Sprite)
var ground;
var bridge_top;
var bridge_down;
var river;

// Maintain all minions in queue
var minion = [];

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

    // Debug
    var orge = new ORGE( x_unit , y_unit );
    orge.change_direction(1);
    orge.setpos(500,300);
    main_stage.addChild(orge.obj);

    minion.push(orge);

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
		each_mini.obj.x += each_mini.vx;
        each_mini.obj.y += each_mini.vy;
        each_mini.check_boundary(max_w,max_h);
	});
}

var tick = 0;
setInterval(function() {
	minion.forEach(function(each_mini){
        /* Change Direction */
        if(tick%20 == 0){
            each_mini.change_direction(Math.floor((Math.random() * 8)));
        }
		each_mini.walking(tick);
	});
    tick++;
    /* Debug: Dynamic add minion by time */
    if(tick%50 == 0){
        var new_orge = new ORGE( x_unit , y_unit );
        new_orge.change_direction(1);
        new_orge.setpos(Math.floor((Math.random()*500) + 1));
        main_stage.addChild(new_orge.obj);
        minion.push(new_orge);
    }
}, 100);
