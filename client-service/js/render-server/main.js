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
// Bridge
var bridge_w_unit = 6;
var bridge_h_unit = 7;
var bridge_loc_x = 22;
var bridge_loc_y_top = 2;
var bridge_loc_y_down = 11;

// Fundamental structure ( cube )
var main_tower_unit = 6;
var vice_tower_unit = 4;
/* Loading Arena Texture */
PIXI.loader
    .add([
        "battle_field/bridge_texture.png",
        "battle_field/house_texture.png",
        "battle_field/grass.png",
        "battle_field/brick.png",
        "battle_field/grass-brick.png",
        "battle_field/water_texture.png",
        "buildings/castle-blue.png",
        "buildings/castle-red.png",
        "buildings/big_castle.png",
        "buildings/castle-red-new.png",
        "buildings/castle-blue-new.png",
        "buildings/big_castle_new.png"
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
        "minion/elf/elf_archer.gif",
        "minion/elf/elf_dancer.png",
        "minion/elf/elf_dancer_p2.png",
        "minion/elf/elf_dancer_mugshot.png",
        "minion/elf/elf_dancer.gif"
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
        "minion/human/human_rifleman.png",
        "minion/human/human_rifleman_p2.png",
        "minion/human/human_rifleman_mugshot.png"
    ])
    .add([
        "minion/siege/sgram.png",
        "minion/siege/sgram_p2.png",
        "minion/siege/sgram_mugshot.png",
        "minion/siege/engineering_vehicle.png",
        "minion/siege/engineering_vehicle_p2.png",
        "minion/siege/engineering_vehicle_mugshot.png"
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
    river = new PIXI.Sprite(
	       PIXI.loader.resources["battle_field/water_texture.png"].texture
	);
    // set size
    river.width = 6 * x_unit;
    river.height = max_h;
    // setting tower
    var x_bound = 7;
    var main_x_bound = 2;
    /* Row the dice to choose which type of castle */
    let type_of_castle = Math.floor((Math.random() * 2) + 1);
    var p1_vicetower_top = new CASTLE(vice_tower_unit*x_unit,vice_tower_unit*y_unit,'p1_top','p1',type_of_castle);
    p1_vicetower_top.setpos(x_bound*x_unit,2*y_unit);
    var p1_vicetower_down = new CASTLE(vice_tower_unit*x_unit,vice_tower_unit*y_unit,'p1_down','p1',type_of_castle);
    p1_vicetower_down.setpos(x_bound*x_unit,14*y_unit);
    var p1_maintower = new BIG_CASTLE(main_tower_unit*x_unit,main_tower_unit*y_unit,'p1_main','p1',type_of_castle);
    p1_maintower.setpos((main_x_bound)*x_unit,7*y_unit);
    var p2_vicetower_top = new CASTLE(vice_tower_unit*x_unit,vice_tower_unit*y_unit,'p2_top','p2',type_of_castle);
    p2_vicetower_top.setpos((50-x_bound-vice_tower_unit)*x_unit,2*y_unit);
    var p2_vicetower_down = new CASTLE(vice_tower_unit*x_unit,vice_tower_unit*y_unit,'p2_down','p2',type_of_castle);
    p2_vicetower_down.setpos((50-x_bound-vice_tower_unit)*x_unit,14*y_unit);
    var p2_maintower = new BIG_CASTLE(main_tower_unit*x_unit,main_tower_unit*y_unit,'p2_main','p2',type_of_castle);
    p2_maintower.setpos((50-main_x_bound-main_tower_unit)*x_unit,7*y_unit);

    // Setup ground texture
    for(let j=0; j < map_h_unit ; j++ ){
        for(let i=0; i < map_w_unit ; i++){
            if(i == 0 || i == map_w_unit-1 || j == 0 || j == map_h_unit-1){
                // make the brick wall
                let texture = new PIXI.Texture(PIXI.BaseTexture.fromImage('battle_field/grass-brick.png'));
                texture.frame = (new PIXI.Rectangle(0,0,320,320));
                let result = new PIXI.Sprite(texture);
                result.width = x_unit;
                result.height = y_unit;
                result.x = i*x_unit;
                result.y = j*y_unit;
                bg_stage.addChild(result);
            }
            else{
                // random pick an number
                let type_of_grass = Math.floor((Math.random() * 8));
                let texture = new PIXI.Texture(PIXI.BaseTexture.fromImage('battle_field/grass.png'));
                texture.frame = (new PIXI.Rectangle(type_of_grass*320,0,320,320));
                let result = new PIXI.Sprite(texture);
                result.width = x_unit;
                result.height = y_unit;
                result.x = i*x_unit;
                result.y = j*y_unit;
                bg_stage.addChild(result);
            }
        }
    }
    // river
    bg_stage.addChild(river);

    // Setting top bridge
    for(let j=bridge_loc_y_top;j<bridge_loc_y_top+bridge_h_unit;j++){
        for(let i=bridge_loc_x;i<bridge_loc_x+bridge_w_unit;i++){
            if(j==bridge_loc_y_top || j==bridge_loc_y_top-1+bridge_h_unit){
                // Draw bridge brick
                let texture = new PIXI.Texture(PIXI.BaseTexture.fromImage('battle_field/brick.png'));
                texture.frame = (new PIXI.Rectangle(0,0,320,320));
                let result = new PIXI.Sprite(texture);
                result.width = x_unit;
                result.height = y_unit;
                result.x = i*x_unit;
                result.y = j*y_unit;
                bg_stage.addChild(result);
            }
            else{
                // Draw bridge texture
                let type_of_bridge = Math.floor((Math.random() * 2));
                let texture = new PIXI.Texture(PIXI.BaseTexture.fromImage('battle_field/bridge_texture.png'));
                texture.frame = (new PIXI.Rectangle(type_of_bridge*320,0,320,320));
                let result = new PIXI.Sprite(texture);
                result.width = x_unit;
                result.height = y_unit;
                result.x = i*x_unit;
                result.y = j*y_unit;
                bg_stage.addChild(result);
            }
        }
    }
    // Setting down bridge
    for(let j=bridge_loc_y_down;j<bridge_loc_y_down+bridge_h_unit;j++){
        for(let i=bridge_loc_x;i<bridge_loc_x+bridge_w_unit;i++){
            if(j==bridge_loc_y_down || j==bridge_loc_y_down-1+bridge_h_unit){
                // Draw bridge brick
                let texture = new PIXI.Texture(PIXI.BaseTexture.fromImage('battle_field/brick.png'));
                texture.frame = (new PIXI.Rectangle(0,0,320,320));
                let result = new PIXI.Sprite(texture);
                result.width = x_unit;
                result.height = y_unit;
                result.x = i*x_unit;
                result.y = j*y_unit;
                bg_stage.addChild(result);
            }
            else{
                // Draw bridge texture
                let type_of_bridge = Math.floor((Math.random() * 2));
                let texture = new PIXI.Texture(PIXI.BaseTexture.fromImage('battle_field/bridge_texture.png'));
                texture.frame = (new PIXI.Rectangle(type_of_bridge*320,0,320,320));
                let result = new PIXI.Sprite(texture);
                result.width = x_unit;
                result.height = y_unit;
                result.x = i*x_unit;
                result.y = j*y_unit;
                bg_stage.addChild(result);
            }
        }
    }

    // add them into scene
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
    river.position.set(22*x_unit,0);

    // Add Timer and mana
    battle_timer = new PIXI.Text("Min:Sec",font_style);
    battle_timer.x = max_w/2 - battle_timer.width/2;
    battle_timer.y = 0;
    // Add mana
    p1_mana = new PIXI.Text("P1 Mana:",font_style);
    p1_mana.x = 0;
    p1_mana.y = 0;
    p2_mana = new PIXI.Text("P2 Mana:",font_style);
    p2_mana.x = max_w - p2_mana.width;
    p2_mana.y = 0;

    let player1_name = document.getElementById('c_player').value;
    let player2_name = document.getElementById('n_player').value;
    p1_name = new PIXI.Text(player1_name,font_style);
    p1_name.x = 0;
    p1_name.y = max_h - p1_name.height;
    p2_name = new PIXI.Text(player2_name,font_style);
    p2_name.x = max_w - p2_name.width;
    p2_name.y = max_h - p2_name.height;

    // Push Them into background container
    bg_stage.addChild(battle_timer);
    bg_stage.addChild(p1_mana);
    bg_stage.addChild(p2_mana);
    bg_stage.addChild(p1_name);
    bg_stage.addChild(p2_name);
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
        minion[index].move(1);
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
