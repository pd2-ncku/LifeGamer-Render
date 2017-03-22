/* Battle field Initialize */
// Setup Game Frame Measurement
var max_w = size_adapter.offsetWidth;
var max_h = size_adapter.offsetHeight;
var map_w_unit = 50;
var map_h_unit = 20;
var x_unit = max_w/map_w_unit;
var y_unit = max_h/map_h_unit;

// Battle field Background variable
var river_w_unit = 6;
var river_h_unit = 20;
var bridge_w_unit = 6;
var bridge_h_unit = 4;

// Fundamental structure ( cube )
var main_tower_unit = 6;
var vice_tower_unit = 4;
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
        "minion/unknown.png"
    ])
    .add([
        "minion/elf/elf_rock_giant.png",
        "minion/elf/elf_rock_giant_p2.png",
        "minion/elf/elf_rock_giant_mugshot.png",
        "minion/elf/elf_wisp.png",
        "minion/elf/elf_wisp_p2.png",
        "minion/elf/elf_wisp_mugshot.png",
        "minion/elf/elf_archer.png",
        "minion/elf/elf_archer_p2.png",
        "minion/elf/elf_archer_mugshot.png",
        "minion/elf/elf_archer.gif"
    ])
    .add([
        "minion/human/human_priest.png",
        "minion/human/human_priest_p2.png",
        "minion/human/human_priest_mugshot.png",
        "minion/human/human_knight.png",
        "minion/human/human_knight_p2.png",
        "minion/human/human_knight_mugshot.png",
        "minion/human/human_thief.png",
        "minion/human/human_thief_p2.png",
        "minion/human/human_thief_mugshot.png",
        "minion/human/human_piper.png",
        "minion/human/human_piper_p2.png",
        "minion/human/human_piper_mugshot.png",
    ])
    .add([
        "minion/siege/sgram.png",
        "minion/siege/sgram_p2.png",
        "minion/siege/sgram_mugshot.png",
    ])
    .add([
        "minion/undead/undead_samurai.png",
        "minion/undead/undead_samurai_p2.png",
        "minion/undead/undead_samurai_mugshot.png",
        "minion/undead/undead_alchemist.png",
        "minion/undead/undead_alchemist_p2.png",
        "minion/undead/undead_alchemist_mugshot.png",
    ])
    .on("progress", loadProgressHandler)
    .load(setup);

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
    // Define renderer's container
    renderer.render(wrapper);
    // Define card deck container
    p1_hand_renderer.render(P1_carddeck_handler.stage);
    p2_hand_renderer.render(P2_carddeck_handler.stage);
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
        // Closin card deck
        P1_carddeck_handler.stage.alpha -= 0.01;
        P2_carddeck_handler.stage.alpha -= 0.01;
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
