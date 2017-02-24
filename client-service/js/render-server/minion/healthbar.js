var HealthBar = function(w_size,h_size){
    var bar = new PIXI.Container();
    bar.position.set(0,0);
    var hp_innerbar = new PIXI.Graphics();
    hp_innerbar.beginFill(0x000000);
    hp_innerbar.drawRect(0,0,w_size,h_size);
    hp_innerbar.endFill();
    bar.addChild(hp_innerbar);
    var hp_outerbar = new PIXI.Graphics();
    hp_outerbar.beginFill(0xFF3300);
    hp_outerbar.drawRect(0,0,w_size,h_size);
    hp_outerbar.endFill();
    bar.addChild(hp_outerbar);
    bar.outer = hp_outerbar;

    return bar;
}
