/* Declare Elf Archer */
var ELF_ROCK_GIANT = function( char_w,char_h,object_No,max_w,max_h,belong ){
    /* constructor */
    this.src_frame_w = 320;
    this.src_frame_h = 320;
    this.picture_frame = 6;
    this.scale = 2;
    this.boundary_x = max_w;
    this.boundary_y = max_h;
    this.direction = -1; // Stop
    this.vx = 0;
    this.vy = 0;
    // Recording previous x,y location
    this.pre_x = 0;
    this.pre_y = 0;

    this.object_No = object_No; // Use for detective ( Convenience to distinguish )
    // sound effect
    var summon = new Howl({
        src: ['elf/elf_giant_summon.mp3'],
        loop: false
    });
    summon.play();
    this.sound = new Howl({
        src: ['elf/elf_giant_walking.mp3'],
        loop: true,
        volume: 0.5
    });
    this.atk_sound = new Howl({
        src: ['elf/elf_giant_attack.mp3'],
        loop: true,
        volume: 0.5
    });
    // Health Bar
    this.hp = new HealthBar((3/2)*char_w*this.scale,10);
    this.hp_unit = Math.ceil(((3/2)*char_w*this.scale)/100);
    /* Using belong to choose the target (distinguish different players) texture */
    if(belong == 'p1'){
        /* setting path to p1 image */
        this.image_url = "minion/elf/elf_rock_giant.png";
    }
    else{
        /* FIXME: setting path to p2 image */
        this.image_url = "minion/elf/elf_rock_giant_p2.png";
    }
    var texture = new PIXI.Texture(PIXI.BaseTexture.fromImage(this.image_url));
    texture.frame = (new PIXI.Rectangle(0,0,this.src_frame_w,this.src_frame_h));
    var result = new PIXI.Sprite(texture);
    result.width = char_w*this.scale;
    result.height = char_h*this.scale;
    result.x = 0;
    result.y = 0;
    this.basic_velocity_x = 0.5;
    this.basic_velocity_y = 0.5;
    this.velocity_rate = 2;
    this.obj = result;
    /* Setting character direction in image source location */
    this.left = 2;
    this.right = 0;
    this.top = 2;
    this.down = 0;
    this.left_top = 2;
    this.left_down = 2;
    this.right_top = 0;
    this.right_down = 0;
    this.left_atk = 3;
    this.right_atk = 1;
}

ELF_ROCK_GIANT.prototype.walking = function(current_tick){
    var texture = new PIXI.Texture(PIXI.BaseTexture.fromImage(this.image_url));
    switch (this.direction) {
        case 0:
            // left
            texture.frame = (new PIXI.Rectangle((this.src_frame_w)*(current_tick%this.picture_frame),this.src_frame_h*this.left,this.src_frame_w,this.src_frame_h));
            this.obj.setTexture(texture);
            // and change velocity
            this.vx = (-1)*this.basic_velocity_x;
            this.vy = 0;
            // sound
            this.sound_effect(1);
            break;
        case 1:
            // Right
            texture.frame = (new PIXI.Rectangle(0+(this.src_frame_w)*(current_tick%this.picture_frame),this.src_frame_h*this.right,this.src_frame_w,this.src_frame_h));
            this.obj.setTexture(texture);
            // change velocity
            this.vx = this.basic_velocity_x;
            this.vy = 0;
            // sound
            this.sound_effect(1);
            break;
        case 2:
            // Top
            texture.frame = (new PIXI.Rectangle(0+(this.src_frame_w)*(current_tick%this.picture_frame),this.src_frame_h*this.top,this.src_frame_w,this.src_frame_h));
            this.obj.setTexture(texture);
            // change velocity
            this.vx = 0;
            this.vy = (-1)*this.basic_velocity_y;
            // sound
            this.sound_effect(1);
            break;
        case 3:
            // Down
            texture.frame = (new PIXI.Rectangle(0+(this.src_frame_w)*(current_tick%this.picture_frame),this.src_frame_h*this.down,this.src_frame_w,this.src_frame_h));
            this.obj.setTexture(texture);
            // change velocity
            this.vx = 0;
            this.vy = this.basic_velocity_y;
            // sound
            this.sound_effect(1);
            break;
        case 4:
            // Left + Top
            texture.frame = (new PIXI.Rectangle((this.src_frame_w)*(current_tick%this.picture_frame),this.src_frame_h*this.left_top,this.src_frame_w,this.src_frame_h));
            this.obj.setTexture(texture);
            // change velocity
            this.vx = (-0.707)*this.basic_velocity_x;
            this.vy = (-0.707)*this.basic_velocity_y;
            // sound
            this.sound_effect(1);
            break;
        case 5:
            // Left + down
            texture.frame = (new PIXI.Rectangle((this.src_frame_w)*(current_tick%this.picture_frame),this.src_frame_h*this.left_down,this.src_frame_w,this.src_frame_h));
            this.obj.setTexture(texture);
            // change velocity
            this.vx = (-0.707)*this.basic_velocity_x;
            this.vy = (0.707)*this.basic_velocity_y;
            // sound
            this.sound_effect(1);
            break;
        case 6:
            // Right + Top
            texture.frame = (new PIXI.Rectangle((this.src_frame_w)*(current_tick%this.picture_frame),this.src_frame_h*this.right_top,this.src_frame_w,this.src_frame_h));
            this.obj.setTexture(texture);
            // change velocity
            this.vx = (0.707)*this.basic_velocity_x;
            this.vy = (-0.707)*this.basic_velocity_y;
            // sound
            this.sound_effect(1);
            break;
        case 7:
            // Right + down
            texture.frame = (new PIXI.Rectangle((this.src_frame_w)*(current_tick%this.picture_frame),this.src_frame_h*this.right_down,this.src_frame_w,this.src_frame_h));
            this.obj.setTexture(texture);
            // change velocity
            this.vx = (0.707)*this.basic_velocity_x;
            this.vy = (0.707)*this.basic_velocity_y;
            // sound
            this.sound_effect(1);
            break;
        case 8:
            // attack , left
            texture.frame = (new PIXI.Rectangle((this.src_frame_w)*(current_tick%this.picture_frame),this.src_frame_h*this.left_atk,this.src_frame_w,this.src_frame_h));
            this.obj.setTexture(texture);
            // change velocity
            this.vx = 0;
            this.vy = 0;
            // sound
            this.sound_effect(0);
            break;
        case 9:
            // attack , right
            texture.frame = (new PIXI.Rectangle((this.src_frame_w)*(current_tick%this.picture_frame),this.src_frame_h*this.right_atk,this.src_frame_w,this.src_frame_h));
            this.obj.setTexture(texture);
            // change velocity
            this.vx = 0;
            this.vy = 0;
            // sound
            this.sound_effect(0);
            break;
        case 10:
            // stop , face right
            texture.frame = (new PIXI.Rectangle(0+(this.src_frame_w)*(current_tick%this.picture_frame),this.src_frame_h*this.right,this.src_frame_w,this.src_frame_h));
            this.obj.setTexture(texture);
            this.vx = 0;
            this.vy = 0;
            // sound
            this.sound_effect(-1);
            break;
        case 11:
            // stop , face left
            texture.frame = (new PIXI.Rectangle((this.src_frame_w)*(current_tick%this.picture_frame),this.src_frame_h*this.left,this.src_frame_w,this.src_frame_h));
            this.obj.setTexture(texture);
            this.vx = 0;
            this.vy = 0;
            // sound
            this.sound_effect(-1);
            break;
        default:
            // None, just stop and do nothing
            this.vx = 0;
            this.vy = 0;
            // sound
            this.sound_effect(-1);
            break;
    }
}

ELF_ROCK_GIANT.prototype.set_basicV = function(vx,vy){
    this.basic_velocity_x = vx*this.velocity_rate;
    this.basic_velocity_y = vy*this.velocity_rate;
}

ELF_ROCK_GIANT.prototype.set_status = function(hp_var){
    // Setting hp
    if(this.hp.outer.width > 0){
        this.hp.outer.width += hp_var*this.hp_unit;
    }
    else {
        this.hp.outer.width = 0;
    }
}

ELF_ROCK_GIANT.prototype.sound_effect = function(type){
    switch (type) {
        case -1:
            // Stop all sound
            this.sound.stop();
            this.atk_sound.stop();
            break;
        case 0:
            // attack
            if(this.sound.playing() || this.atk_sound.playing()){
                this.sound.stop();
            }else {
                this.sound.stop();
                this.atk_sound.play();
                this.atk_sound.rate(1);
            }
            break;
        case 1:
            // move
            if(this.sound.playing() || this.atk_sound.playing()){
                this.atk_sound.stop();
            }else {
                this.atk_sound.stop();
                this.sound.play();
                this.sound.rate(1);
            }
            break;
        default:

    }
}

ELF_ROCK_GIANT.prototype.kill = function(){
    this.sound_effect(-1);
    delete this.sound;
    delete this.atk_sound;
}

ELF_ROCK_GIANT.prototype.change_direction = function(new_direction){
    // Moving x
	if(this.obj.x+this.obj.width >= this.boundary_x){
		this.obj.x -= 5;
    }
	else if(this.obj.x <= 0){
		this.obj.x += 5;
    }
	// Moving y
	if(this.obj.y+this.obj.height >= this.boundary_y){
        this.obj.y -= 5;
    }
	else if(this.obj.y <= 0){
		this.obj.y += 5;
    }
    this.direction = new_direction;
}

ELF_ROCK_GIANT.prototype.move = function(){
    // Object moving
    this.obj.x += this.vx;
    this.obj.y += this.vy;
    this.hp.x += this.vx;
    this.hp.y += this.vy;
}

ELF_ROCK_GIANT.prototype.set_init_pos = function( loc_x,loc_y ){
    // Using coordinate system value to setup
    this.pre_x = loc_x;
    this.pre_y = loc_y;
}

ELF_ROCK_GIANT.prototype.setpos = function( x,y ){
    this.obj.position.set(x,y);
    // Because of being center , hp bar x must be (loc_x_obj + w_obj/2 - w_hp/2)
    this.hp.position.set(x+(this.obj.width)/2-(this.hp.width)/2,y-(this.obj.height/4));
}

ELF_ROCK_GIANT.prototype.set_loc_by_xy = function( next_x,next_y,direction ){
    // Receive next tick location x,y
    // Judging by these two x,y
    // And if status is attack or stop , priority are highest
    if(direction == 8 || direction == 9 || direction == 10 || direction == 11 ){
        this.change_direction(direction);
    }
    else{
        // If now special position , do walking
        if( this.pre_x > next_x && this.pre_y > next_y ){
            // go left and top
            this.change_direction(4);
        }else if( this.pre_x > next_x && this.pre_y == next_y ){
            // go left
            this.change_direction(0);
        }else if( this.pre_x > next_x && this.pre_y < next_y ){
            // go left and down
            this.change_direction(5);
        }else if( this.pre_x < next_x && this.pre_y > next_y ){
            // go right top
            this.change_direction(6);
        }else if( this.pre_x < next_x && this.pre_y == next_y ){
            // go right
            this.change_direction(1);
        }else if( this.pre_x < next_x && this.pre_y < next_y ){
            // go right and down
            this.change_direction(7);
        }else if( this.pre_x == next_x && this.pre_y > next_y ){
            // go top
            this.change_direction(2);
        }else if( this.pre_x == next_x && this.pre_y < next_y ){
            // go down
            this.change_direction(3);
        }
    }
    // Pass this pair of x,y to previous
    this.pre_x = next_x;
    this.pre_y = next_y;

}

ELF_ROCK_GIANT.prototype.check_boundary = function(){
    // x
	if(this.obj.x+this.obj.width >= this.boundary_x){
		this.vx = 0;
        this.direction = -1;
    }
	else if(this.obj.x <= 0){
		this.vx = 0;
        this.direction = -1;
    }
	// y
	if(this.obj.y+this.obj.height >= this.boundary_y){
		this.vy = 0;
        this.direction = -1;
    }
	else if(this.obj.y <= 0){
		this.vy = 0;
        this.direction = -1;
    }
}
