// Dealing with player hand render job
/*
    When using this object , it represent a hand of current game (so it will have 2 as maximum in one game)
    Constructor :
                Initialize "current hand" , with length 0;
                Initialize PIXI.Container as attributes
                And setup (Initialize) the stage (PIXI) of hand (prepare for drawing card picture later)
    update :
                Compare input array and previous array (checkout what's different and change card picture)
*/
var PLAYER_HAND = function(belong,max_w,max_h,battle_stage){
    // Create new stage
    this.stage = new PIXI.Container();
    // Load all image source into PLAYER_HAND
    this.texture_map = {};
    // Load elf
    this.texture_map['elf_archer'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/elf/elf_archer_mugshot.png"));
    this.texture_map['elf_wisp'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/elf/elf_wisp_mugshot.png"));
    this.texture_map['elf_giant'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/elf/elf_rock_giant_mugshot.png"));
    this.texture_map['elf_dancer'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/elf/elf_dancer_mugshot.png"));
    // Load human
    this.texture_map['human_knight'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/human/human_knight_mugshot.png"));
    this.texture_map['human_priest'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/human/human_priest_mugshot.png"));
    this.texture_map['human_thief'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/human/human_thief_mugshot.png"));
    this.texture_map['human_piper'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/human/human_piper_mugshot.png"));
    // Load siege
    this.texture_map['sgram'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/siege/sgram_mugshot.png"));
    // Load undead
    this.texture_map['undead_samurai'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/undead/undead_samurai_mugshot.png"));
    this.texture_map['undead_alchemist'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/undead/undead_alchemist_mugshot.png"));
    // Load waling pic
    var walking_texture = {};
    walking_texture['elf_archer'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/elf/elf_archer.gif"));
    walking_texture['elf_giant'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/elf/elf_rock_giant.gif"));
    walking_texture['elf_dancer'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/elf/elf_dancer.gif"));
    walking_texture['elf_wisp'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/elf/elf_wisp.gif"));
    walking_texture['human_knight'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/human/human_knight.gif"));
    walking_texture['human_piper'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/human/human_piper.gif"));
    walking_texture['human_priest'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/human/human_priest.gif"));
    walking_texture['human_theif'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/human/human_thief.gif"));
    walking_texture['sgram'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/siege/sgram.gif"));
    walking_texture['undead_samurai'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/undead/undead_samurai.gif"));
    walking_texture['undead_alchemist'] = new PIXI.Texture(PIXI.BaseTexture.fromImage("minion/undead/undead_alchemist.gif"));
    /* Create 4 sprite :
        obj: store Sprite it have
        userdata: record current minion name
    */
    this.sprite = {};
    this.sprite[0] = {
        obj: new PIXI.Sprite(this.texture_map['elf_archer'])
    };
    this.sprite[0].obj.belong = belong;
    this.sprite[0].obj.width = max_w;
    this.sprite[0].obj.height = max_w;
    this.sprite[0].obj.userdata = 'elf_archer';
    this.sprite[0].obj.main_stage = battle_stage;
    this.sprite[0].obj.texture_map = walking_texture;
    this.sprite[0].obj.underdeck = true;
    this.sprite[0].obj.x = 0;
    this.sprite[0].obj.y = max_h/2 - 2*max_w;
    this.sprite[0].obj.bound_x = max_w;
    this.sprite[0].obj.bound_y = max_h;
    this.sprite[1] = {
        obj: new PIXI.Sprite(this.texture_map['elf_dancer'])
    };
    this.sprite[1].obj.belong = belong;
    this.sprite[1].obj.width = max_w;
    this.sprite[1].obj.height = max_w;
    this.sprite[1].obj.userdata = 'elf_dancer';
    this.sprite[1].obj.texture_map = walking_texture;
    this.sprite[1].obj.underdeck = true;
    this.sprite[1].obj.main_stage = battle_stage;
    this.sprite[1].obj.x = 0;
    this.sprite[1].obj.y = max_h/2 - max_w;
    this.sprite[1].obj.bound_x = max_w;
    this.sprite[1].obj.bound_y = max_h;
    this.sprite[2] = {
        obj: new PIXI.Sprite(this.texture_map['elf_giant'])
    }
    this.sprite[2].obj.belong = belong;
    this.sprite[2].obj.width = max_w;
    this.sprite[2].obj.height = max_w;
    this.sprite[2].obj.userdata = 'elf_giant';
    this.sprite[2].obj.texture_map = walking_texture;
    this.sprite[2].obj.underdeck = true;
    this.sprite[2].obj.main_stage = battle_stage;
    this.sprite[2].obj.x = 0;
    this.sprite[2].obj.y = max_h/2;
    this.sprite[2].obj.bound_x = max_w;
    this.sprite[2].obj.bound_y = max_h;
    this.sprite[3] = {
        obj: new PIXI.Sprite(this.texture_map['sgram'])
    }
    this.sprite[3].obj.belong = belong;
    this.sprite[3].obj.width = max_w;
    this.sprite[3].obj.height = max_w;
    this.sprite[3].obj.userdata = 'sgram';
    this.sprite[3].obj.texture_map = walking_texture;
    this.sprite[3].obj.underdeck = true;
    this.sprite[3].obj.main_stage = battle_stage;
    this.sprite[3].obj.x = 0;
    this.sprite[3].obj.y = max_h/2 + max_w;
    this.sprite[3].obj.bound_x = max_w;
    this.sprite[3].obj.bound_y = max_h;

    this.stage.addChild(this.sprite[0].obj);
    this.stage.addChild(this.sprite[1].obj);
    this.stage.addChild(this.sprite[2].obj);
    this.stage.addChild(this.sprite[3].obj);

    this.subscribe(this.sprite[0].obj);
    this.subscribe(this.sprite[1].obj);
    this.subscribe(this.sprite[2].obj);
    this.subscribe(this.sprite[3].obj);

    // var result = new PIXI.Sprite(texture);
    this.stage_width = max_w;
    this.stage_height = max_h;
    // Calculate 4 card size and location of card picture
}

PLAYER_HAND.prototype.update = function(new_arr){
    // Using new received array to update player's hand
    for(var index in new_arr){
        this.sprite[index].obj.setTexture(this.texture_map[new_arr[index].name]);
        this.sprite[index].obj.userdata = new_arr[index].name;
    }
}

PLAYER_HAND.prototype.subscribe = function(obj){
    obj.interactive = true;
    obj.on('mousedown',onDragStart)
        .on('touchstart',onDragStart)
        .on('mouseup',onDragEnd)
        .on('mouseupoutside',onDragEnd)
        .on('touchend',onDragEnd)
        .on('touchendoutside',onDragEnd)
        .on('mousemove',onDragMove)
        .on('touchmove',onDragMove);
}

// Drag and drop event
function onDragStart(event){
    console.log("On drag , userdata: "+this.userdata);
    console.dir(event);
    if (!this.dragging) {
        this.data = event.data;
        //this.oldGroup = this.displayGroup;
        //this.displayGroup = dragLayer;
        this.dragging = true;

        this.scale.x *= 1.1;
        this.scale.y *= 1.1;
        this.dragPoint = event.data.getLocalPosition(this.parent);
        this.dragPoint.x -= this.x;
        this.dragPoint.y -= this.y;
    }
}

function onDragEnd(event){
    console.log("On End");
    if(this.dragging) {
       this.dragging = false;
       //this.displayGroup = this.oldGroup;
       if(this.x > this.bound_x || this.y > this.bound_y){
           this.underdeck = false;
       }
       this.scale.x /= 1.1;
       this.scale.y /= 1.1;
       // set the interaction data to null
       this.data = null;
   }
}

function onDragMove(event){
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x - this.dragPoint.x;
        this.y = newPosition.y - this.dragPoint.y;
        if(this.belong == 'p1' && this.underdeck == true){
            if(this.x > this.bound_x || this.y > this.bound_y){
                this.setParent(this.main_stage);
                this.x -= this.bound_x;
                this.setTexture(this.texture_map[this.userdata]);
                this.main_stage.addChild(this);
            }
        }
        else{
            /*if(this.x < 0 || this.y > this.bound_y){
                this.setParent(this.main_stage);
                this.x -= this.bound_x;
                this.main_stage.addChild(this);
            }*/
        }
    }
}
