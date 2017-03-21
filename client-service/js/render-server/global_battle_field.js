/* Global variable */
// Maintain all minions in queue
var minion = [];
var buildings = [];
var p1_current_hand = [];
var p2_current_hand = [];
// Scene Part
var wrapper = new PIXI.Container();
var main_stage = new PIXI.Container();
var close_stage = new PIXI.Container();
wrapper.addChild(close_stage);
wrapper.addChild(main_stage);
close_stage.alpha = 0;

// Setting Global object (Sprite)
var ground;
var bridge_top;
var bridge_down;
var river;

// Render Battlefield part
var size_adapter = document.getElementById('arena');
var renderer = PIXI.autoDetectRenderer(size_adapter.offsetWidth,size_adapter.offsetHeight);
renderer.backgroundColor = 0x1099bb;
// Render player's hand
var p1_hand_size_adapter = document.getElementById('p1_hand');
var p1_hand_renderer = PIXI.autoDetectRenderer(p1_hand_size_adapter.offsetWidth,p1_hand_size_adapter.offsetHeight);
p1_hand_renderer.backgroundColor = 0x000000;
var p2_hand_size_adapter = document.getElementById('p2_hand');
var p2_hand_renderer = PIXI.autoDetectRenderer(p2_hand_size_adapter.offsetWidth,p2_hand_size_adapter.offsetHeight);
p2_hand_renderer.backgroundColor = 0x000000;
// Another Container (user's hand) will initialize with PLAYER_HAND
var P1_carddeck_handler = new PLAYER_HAND('p1',p1_hand_size_adapter.offsetWidth,p1_hand_size_adapter.offsetHeight,main_stage);
var P2_carddeck_handler = new PLAYER_HAND('p2',p2_hand_size_adapter.offsetWidth,p2_hand_size_adapter.offsetHeight,main_stage);
// Append render view into DOM tree
document.getElementById("arena").appendChild(renderer.view);
document.getElementById("p1_hand").appendChild(p1_hand_renderer.view);
document.getElementById("p2_hand").appendChild(p2_hand_renderer.view);
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
