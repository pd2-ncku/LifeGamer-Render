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
var PLAYER_HAND = function(max_w,max_h){
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
    /* Create 4 sprite :
        obj: store Sprite it have
        userdata: record current minion name
    */
    this.sprite = {};
    this.sprite[0] = {
        obj: new PIXI.Sprite(this.texture_map['elf_archer']),
        userdata: "elf_archer"
    };
    this.sprite[0].obj.width = max_w;
    this.sprite[0].obj.height = max_w;
    this.sprite[0].obj.x = 0;
    this.sprite[0].obj.y = max_h/2 - 2*max_w;
    this.sprite[1] = {
        obj: new PIXI.Sprite(this.texture_map['elf_dancer']),
        userdata: "elf_archer"
    };
    this.sprite[1].obj.width = max_w;
    this.sprite[1].obj.height = max_w;
    this.sprite[1].obj.x = 0;
    this.sprite[1].obj.y = max_h/2 - max_w;
    this.sprite[2] = {
        obj: new PIXI.Sprite(this.texture_map['elf_giant']),
        userdata: "elf_giant"
    }
    this.sprite[2].obj.width = max_w;
    this.sprite[2].obj.height = max_w;
    this.sprite[2].obj.x = 0;
    this.sprite[2].obj.y = max_h/2;
    this.sprite[3] = {
        obj: new PIXI.Sprite(this.texture_map['sgram']),
        userdata: "sgram"
    }
    this.sprite[3].obj.width = max_w;
    this.sprite[3].obj.height = max_w;
    this.sprite[3].obj.x = 0;
    this.sprite[3].obj.y = max_h/2 + max_w;

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
        this.sprite[index].userdata = new_arr[index].name;
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

PLAYER_HAND.prototype.addShadow = function(obj) {
    var gr = new PIXI.Graphics();
    gr.beginFill(0x0, 1);
    //yes , I know bunny size, I'm sorry for this hack
    var scale = 1.1;
    gr.drawRect(-25/2 * scale, -36/2 * scale, 25 * scale, 36 * scale);
    gr.endFill();
    var blurFilter = new PIXI.filters.blurFilter();
    blurFilter.blur = 0.5;
    gr.filters = [blurFilter];

    //gr.displayGroup = shadowLayer;
    obj.addChild(gr);
}

// Drag and drop event
function onDragStart(event){
    console.log("On drag.");
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
       this.scale.x /= 1.1;
       this.scale.y /= 1.1;
       // set the interaction data to null
       this.data = null;
   }
}

function onDragMove(event){
    console.log("On Move");
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x - this.dragPoint.x;
        this.y = newPosition.y - this.dragPoint.y;
    }
}
