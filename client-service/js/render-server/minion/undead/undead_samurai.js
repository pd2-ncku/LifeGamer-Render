/* Declare Elf Archer */
var UNDEAD_SAMURAI = function( char_w,char_h,object_No,max_w,max_h,belong,loc_x,loc_y ){
    // ====================================== Call Parent constructor ======================================
    MINION.call(this,char_w,char_h,object_No,max_w,max_h,belong,loc_x,loc_y);
    /* constructor */
    this.src_frame_w = 640;
    this.src_frame_h = 640;
    this.picture_frame = 6;
    // Adjust size
    this.scale = 4;
    this.boundary_x = max_w;
    this.boundary_y = max_h;
    this.direction = -1; // Stop
    this.vx = 0;
    this.vy = 0;
    // Recording previous x,y location
    this.pre_x = loc_x;
    this.pre_y = loc_y;
    this.x_unit = char_w;
    this.y_unit = char_h;

    this.object_No = object_No; // Use for detective ( Convenience to distinguish )
    // sound effect
    var summon = new Howl({
        src: ['undead/undead_samurai_summon.mp3'],
        loop: false
    });
    summon.play();
    this.sound = new Howl({
        src: ['undead/undead_samurai_walking.mp3'],
        loop: true,
        volume: 0.5
    });
    this.atk_sound = new Howl({
        src: ['undead/undead_samurai_attack.mp3'],
        loop: true,
        volume: 0.5
    });
    // Health Bar
    this.hp = new HealthBar((3/2)*char_w*this.scale,10);
    // this.hp_unit = Math.ceil(((3/2)*char_w*this.scale)/100);
    this.hp_unit = (((3/2)*char_w*this.scale)/100);
    console.log("Samurai Total: "+ (3/2)*char_w*this.scale + ", Per Unit: " + this.hp_unit);
    /* Using belong to choose the target (distinguish different players) texture */
    if(belong == 'p1'){
        /* setting path to p1 image */
        this.image_url = "minion/undead/undead_samurai.png";
    }
    else{
        /* FIXME: setting path to p2 image */
        this.image_url = "minion/undead/undead_samurai_p2.png";
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
    this.velocity_rate = 1;
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

// ====================================== Create Prototype ======================================
UNDEAD_SAMURAI.prototype = Object.create(MINION.prototype);
// ====================================== Define constructor ======================================
UNDEAD_SAMURAI.prototype.constructor = UNDEAD_SAMURAI;
