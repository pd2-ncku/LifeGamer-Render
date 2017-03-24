/* Big castle implementation
    char_w : Character width
    char_h : Character height
    object_No : use to distinguish among buildings object
    belong : distinguish which use own this
*/
var BIG_CASTLE = function(char_w,char_h,object_No,belong,type_of_castle){
    /* buildings constructor */
    this.scale = 1;
    this.object_No = object_No;

    if(type_of_castle == 1){
        /* Original */
        this.src_frame_w = 1280;
        this.src_frame_h = 1280;
        this.picture_frame = 3;
        /* url */
        this.image_src = "buildings/big_castle.png";
        /* Also , Setting which direction the building face : default - p1->right , p2->left */
        if(belong == 'p1'){
            /* using texture blue */
            this.direction = 0;
        }else{
            /* using texture red */
            this.direction = 1;
        }
    }
    else if(type_of_castle == 2){
        this.src_frame_w = 640;
        this.src_frame_h = 640;
        this.picture_frame = 3;
        /* url */
        this.image_src = "buildings/big_castle_new.png";
        /* Also , Setting which direction the building face : default - p1->right , p2->left */
        if(belong == 'p1'){
            /* using texture blue */
            this.direction = 1;
        }else{
            /* using texture red */
            this.direction = 0;
        }
    }
    // sound effect
    this.dstry_sound = new Howl({
        src: ['buildings/building_destroy.mp3'],
        loop: false
    });

    /* HealthBar */
    this.hp = new HealthBar((3/2)*char_w*this.scale,10);
    this.hp_unit = ((3/2)*char_w*this.scale)/100;
    /* Initialize texture */
    var texture = new PIXI.Texture(PIXI.BaseTexture.fromImage(this.image_src));
    texture.frame = (new PIXI.Rectangle(0,0,this.src_frame_w,this.src_frame_h));
    var result = new PIXI.Sprite(texture);
    result.width = char_w*this.scale;
    result.height = char_h*this.scale;
    result.x = 0;
    result.y = 0;
    /* Give sprite to attribute - obj */
    this.obj = result;
}

BIG_CASTLE.prototype.progressing = function(current_tick){
    /* same usage as "walking" in minion */
    var texture = new PIXI.Texture(PIXI.BaseTexture.fromImage(this.image_src));
    /* let's draw! */
    if(this.direction == 0){
        // face right
        texture.frame = (new PIXI.Rectangle((this.src_frame_w)*(current_tick%this.picture_frame),0,this.src_frame_w,this.src_frame_h));
        this.obj.setTexture(texture);
    }
    else{
        // face right
        texture.frame = (new PIXI.Rectangle((this.src_frame_w)*(current_tick%this.picture_frame),this.src_frame_h,this.src_frame_w,this.src_frame_h));
        this.obj.setTexture(texture);
    }
}

BIG_CASTLE.prototype.set_status = function(hp_var){
    // Setting hp
    if(this.hp.outer.width > 0){
        this.hp.outer.width += hp_var*this.hp_unit;
    }
    else {
        this.hp.outer.width = 0;
    }
}

BIG_CASTLE.prototype.destroy = function(){
    this.dstry_sound.play();
}

BIG_CASTLE.prototype.setpos = function( x,y ){
    this.obj.position.set(x,y);
    this.hp.position.set(x-(this.obj.width/4),y-(this.obj.height/16));
}
