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
    // Create 4 sprite
    this.sprite = {};
    this.sprite[0] = new PIXI.Sprite(this.texture_map['elf_archer']);
    this.sprite[0].width = max_w;
    this.sprite[0].height = max_w;
    this.sprite[0].x = 0;
    this.sprite[0].y = max_h/2 - 2*max_w;
    this.sprite[1] = new PIXI.Sprite(this.texture_map['elf_dancer']);
    this.sprite[1].width = max_w;
    this.sprite[1].height = max_w;
    this.sprite[1].x = 0;
    this.sprite[1].y = max_h/2 - max_w;
    this.sprite[2] = new PIXI.Sprite(this.texture_map['elf_giant']);
    this.sprite[2].width = max_w;
    this.sprite[2].height = max_w;
    this.sprite[2].x = 0;
    this.sprite[2].y = max_h/2;
    this.sprite[3] = new PIXI.Sprite(this.texture_map['sgram']);
    this.sprite[3].width = max_w;
    this.sprite[3].height = max_w;
    this.sprite[3].x = 0;
    this.sprite[3].y = max_h/2 + max_w;

    this.stage.addChild(this.sprite[0]);
    this.stage.addChild(this.sprite[1]);
    this.stage.addChild(this.sprite[2]);
    this.stage.addChild(this.sprite[3]);

    // var result = new PIXI.Sprite(texture);
    this.stage_width = max_w;
    this.stage_height = max_h;
    // Calculate 4 card size and location of card picture
}

PLAYER_HAND.prototype.update = function(new_arr){
    // Using new received array to update player's hand
    console.log("Array Size: " + new_arr.length);
    for(var index in new_arr){
        console.log("index: " + index + "; And Name : " + new_arr[index].name);
        this.sprite[index].setTexture(this.texture_map[new_arr[index].name]);
    }
}
