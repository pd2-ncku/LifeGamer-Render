/*
*	Define Battlefield here
*/

// ==================================================== Connection Event ====================================================
/* Disconnect event */
window.addEventListener("beforeunload", function(e){
    socket.emit('disconnect');
}, false);
// Handle socket.io
var raw_data = 0,old = 0;
var socket = io.connect();
socket.on('raw', function(data){
	console.log("Old: " + old + ", New Receive: " + data.cmd);
    if(data.cmd != undefined){
    	if(old == data.cmd){
    		console.log(" Same value: "+raw_data + "; Size: " + minion.length);
    	}
    	else{
    		// data update
    		raw_data = data.cmd;
    		old = raw_data;
    		// Add object
    		var new_man = new MINION1(0,"gb_walk.png",1);
    		new_man.m_pos(1000,400);
    		substage.addChild(new_man.obj);
    		minion.push(new_man);
    		// Debug message
    		console.log(" Diff value receive: "+raw_data);
    	}
    }
});

/* Error condition send back */
function error_notify(err_msg){
    socket.emit('er',{
        'case': err_msg
    });
}
// ==================================================== Resource  ====================================================
// Create a container object - stage
var stage = new PIXI.Container();
var substage = new PIXI.Container();
/* Create the render(size of sandbox) */
var renderer = PIXI.autoDetectRenderer(1200,600);
document.getElementById("arena").appendChild(renderer.view);

PIXI.loader
    .add( [
		"gray_wrapper.png",
		"logo-wrapper.jpg",
		"logo-wrapper2.jpg"
	])
	.add([
		"gb_walk.png"
	])
    .load(setup);

var background;
var element_obj;
var man,man2;
var minion = [];

function setup() {
	// 當loader裏頭的add都完成時，便會執行setup這隻function裏頭的工作!
	background = new PIXI.Sprite(
	PIXI.loader.resources["gray_wrapper.png"].texture
	);
	element_obj = new PIXI.Sprite(
	PIXI.loader.resources["logo-wrapper.jpg"].texture
	);
	background2 = new PIXI.Sprite(
	PIXI.loader.resources["logo-wrapper2.jpg"].texture
	);

	// Loading subimage
	man = new MINION1(0,"gb_walk.png",1);
	man.m_pos(10,10);
	man2 = new MINION1(77,"gb_walk.png",-1);
	man2.m_pos(1000,200);

	// sprite.scale.set(0.5,0.5);
	background.width = 1200;
	background.height = 600;

	background2.width = 1200;
	background2.height = 600;

	element_obj.scale.set(0.3,0.3);

	background.vx= 0;
	background.vy= 0;
	stage.addChild(background);
	stage.addChild(element_obj);
	substage.addChild(background2);
	substage.addChild(man.obj);
	substage.addChild(man2.obj);

	// Push into array
	minion.push(man);
	minion.push(man2);
	// start game loop
	gameLoop();
}

// ==================================================== Character Setting ====================================================

// ==================================================== Game Loop ====================================================
state = play;
var current_stage = substage;
function gameLoop(){
    requestAnimationFrame(gameLoop);
    state();
    // * Need to set in gameLoop *
    renderer.render(current_stage);
}

function play(){
    //console.log(raw_data);
	/*if(raw_data != undefined && raw_data != ''){
    	background.x += parseInt(raw_data);
		current_stage = stage;
	}*/
	/*if(__new != undefined && __new != ''){
		// New an minion
		var new_man = new MINION1(0,"gb_walk.png",1);
		new_man.m_pos(1000,400);
		substage.addChild(new_man);
		minion.push(new_man);
	}*/

	minion.forEach(function(each_mini){
		each_mini.obj.x += each_mini.v;
		each_mini.m_boundary_check(1200,600);
	});
}

var tick = 1;
setInterval(function() {
	// man 1 update
	//console.log("tick : "+ tick);
	tick = (tick >= 6) ? 1 : tick+1;

	minion.forEach(function(each_mini){
		each_mini.m_play(tick,"move");

	});

}, 100);
