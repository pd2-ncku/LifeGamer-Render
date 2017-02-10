/* Declaration minion object here */
var MINION1 = function( startIndex,img_src,v ){
	this.img_src = img_src;
	this.startIndex = startIndex;
	this.v = v;
	/* self initialize */
	/* Sound load */
	sounds.load([
	  "footstep.mp3"
	]);
	// FIXME Notice here skip "whenloaded" function which define in sound.js
	this.walk_sound = sounds["footstep.mp3"];
	this.walk_sound.loop = true;

	var texture = new PIXI.Texture(PIXI.BaseTexture.fromImage(this.img_src));
	texture.frame = (new PIXI.Rectangle(10,this.startIndex,51,77));
	var result = new PIXI.Sprite(texture);
	result.vx = this.v;
	this.obj = result;
}

MINION1.prototype.m_play = function(tick,action){
	if(action == "move"){
		var texture = new PIXI.Texture(PIXI.BaseTexture.fromImage(this.img_src));
		texture.frame = (new PIXI.Rectangle(10+51*(tick-1),this.startIndex,51,77));
		this.obj.setTexture(texture);
		// Makd sound
		if (!this.walk_sound.playing) {
		  this.walk_sound.play();
		}
	}
}

MINION1.prototype.m_pos = function(x,y){
	this.obj.position.set(x,y);
}

MINION1.prototype.m_boundary_check = function( bx,by ){
	// x
	if(this.obj.x >= bx)
		this.obj.x = 0;
	else if(this.obj.x <= 0)
		this.obj.x = bx;
	// y
	if(this.obj.y >= by)
		this.obj.y = 0;
	else if(this.obj.y <= 0)
		this.obj.y = by;
}
