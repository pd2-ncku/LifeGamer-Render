// Dealing with socket io and command parsing
/* Connection establish */
const socket = io();
// Send join to server
var room_name = document.getElementById('room_name').value;
socket.emit('join',room_name);
// disconnect from server
window.addEventListener("beforeunload", function(e){
    socket.emit('disconnect');
    control_channel.disconnect();
}, false);

var command_buffer = [];
// Command/Data receive
socket.on('raw',function(data){
    /* Receive the message and parse it */
    var raw_data = data;
    command_buffer.push(raw_data);
});

socket.on('replay',function(data){
    /* Replay log receive */
    var record = data.content;
    var index = 0;
    var command_push_rate = 100;
    /* And then push those command in verify tick */
    var command_pusher = setInterval(function(){
        if(index >= record.length){
            /* Go to end */
            // And break down channel
            console.log("End of Game received! Hope you enjoy this game!");
            clearInterval(command_pusher);
            // bg fade out
            bg.fade(1.0,0.0,1000);
            eog.play();
            // Disable all element in minion
            for(let r_index in minion){
                minion[r_index].kill();
                main_stage.removeChild(minion.obj);
                main_stage.removeChild(minion.hp);
            }
            // Find things in buildings
            var winner = '',p1_t=0,p1_main=0,p2_t=0,p2_main=0;
            for(let bu_index in buildings){
                if(buildings[bu_index].object_No.includes('p1')){
                    p1_t++;
                    if(buildings[bu_index].object_No == 'p1_main'){
                        p1_main = 1;
                    }
                }
                else if(buildings[bu_index].object_No.includes('p2')){
                    p2_t++;
                    if(buildings[bu_index].object_No == 'p2_main'){
                        p2_main = 1;
                    }
                }
            }
            if(p1_t == p2_t){
                if(p1_main == p2_main){
                    winner = 'Tie';
                }
                else if(p1_main > p2_main){
                    winner = "p1";
                }
                else if(p1_main < p2_main){
                    winner = "p2";
                }
            }
            else if(p1_t > p2_t){
                if(p1_main == p2_main){
                    winner = 'p1';
                }
                else if(p1_main > p2_main){
                    winner = "p1";
                }
                else if(p1_main < p2_main){
                    winner = "p2";
                }
            }
            else if(p1_t < p2_t){
                if(p1_main == p2_main){
                    winner = 'p2';
                }
                else if(p1_main > p2_main){
                    winner = "p1";
                }
                else if(p1_main < p2_main){
                    winner = "p2";
                }
            }
            // setup close_stage
            var endText = new PIXI.Text('Thank for watching replay of this battle!\nCongratulate Winner: '+winner, font_style);
            endText.x = (size_adapter.offsetWidth - endText.width)/2;
            endText.y = (size_adapter.offsetHeight - endText.height)/2;
            close_stage.addChild(endText);
            state = closegame;
        }
        else{
            command_parser(record[index]);
            index++;
        }
    },command_push_rate);
});

// Dealing with interaction
socket.on('EOG',function(battle_info){
    // FIXME : dealing with final state (and show the result page)
    // And break down channel
    console.log("End of Game received! Hope you enjoy this game!");
    // bg fade out
    bg.fade(1.0,0.0,1000);
    eog.play();
    socket.emit('disconnect');
    // Disable all element in minion
    for(var index in minion){
        minion[index].kill();
        main_stage.removeChild(minion.obj);
        main_stage.removeChild(minion.hp);
    }
    // setup close_stage
    var endText = new PIXI.Text('Thank for playing !\nAnd Congratulate winner :'+ battle_info.winner+'\nP1 destroy: '+battle_info.tower_p1_take+'\nP2 destroy: '+battle_info.tower_p2_take, font_style);
    endText.x = (size_adapter.offsetWidth - endText.width)/2;
    endText.y = (size_adapter.offsetHeight - endText.height)/2;
    close_stage.addChild(endText);
    state = closegame;
});

// Set an Interval to deliver
var tick_simulation = setInterval(function(){
    var latest_cmd;
    if(command_buffer.length > 0){
        // Pop out the first command from command buffer
        latest_cmd = command_buffer.shift();
        command_parser(latest_cmd);
    }
},100);


function command_parser(cmd_obj){
    /* Get current type of message */
    var cmd_type = cmd_obj.cmd;
    var current_minion_list = cmd_obj.current_minion;
    var new_minion_list = cmd_obj.new_minion;
    var tower_list = cmd_obj.buildings;
    // Start parsing
    if(cmd_type == "battle"){
        /* Battle field Ongoing */
        if(current_minion_list.length > 0 ){
            /* Do new checking */
            if(minion.length == 0){
                // Using for loop instead of forEach
                for(var index in current_minion_list){
                    // using add_minion here, using "status" in here
                    var current_minion = current_minion_list[index];
                    add_minion(1,current_minion.belong,current_minion.name,current_minion.type,current_minion.status,current_minion.move,current_minion.loc_x,current_minion.loc_y);
                }

            }
            else{
                /* Control those minion */
                for(var index in current_minion_list){
                    var current_minion = current_minion_list[index];
                    control_minion(current_minion.name,current_minion.status,current_minion.move,current_minion.loc_x,current_minion.loc_y);
                }
            }
        }
        if(new_minion_list.length > 0){
            /* Add new minion */
            for(var index in new_minion_list){
                var new_minion = new_minion_list[index];
                add_minion(0,new_minion.belong,new_minion.name,new_minion.type,100,new_minion.move,new_minion.loc_x,new_minion.loc_y);
            }
        }
        if(tower_list.length > 0){
            // Dealing with buildings
            for(var index in tower_list){
                var tower = tower_list[index];
                control_building(tower.name,tower.status);
            }
        }
    }
    // And then we should update player card deck
    P1_carddeck_handler.update(cmd_obj.current_hand_p1);
    P2_carddeck_handler.update(cmd_obj.current_hand_p2);
}

function control_building(tower_name,tower_status){
    for(var index in buildings){
        if(buildings[index].object_No == tower_name){
            buildings[index].set_status(tower_status);
            if(Math.floor(buildings[index].hp.outer.width) <= 0){
                // Remove this object from the battle field
                buildings[index].destroy();
                main_stage.removeChild(buildings[index].obj);
                main_stage.removeChild(buildings[index].hp);
                buildings.splice(index,1);
                // FIXME : or show ruins on the tower location
            }
        }
    }
}

function control_minion(obj_name,status,direction,loc_x,loc_y){
    for(var index in minion){
        if(minion[index].object_No == obj_name){
            // Remove this minion from the battle field
            console.log("Before-> Minion HP: " + minion[index].hp.outer.width);
            minion[index].set_status(status);
            console.log("After-> Minion HP: " + minion[index].hp.outer.width);
            if(Math.floor(minion[index].hp.outer.width) <= 7){
                // Remove this object from battle field
                main_stage.removeChild(minion[index].obj);
                main_stage.removeChild(minion[index].hp);
                minion[index].kill();
                minion.splice(index,1);
            }
            else{
                // Using loc_x and loc_y to set current minion direction
                minion[index].set_loc_by_xy(loc_x,loc_y,parseInt(direction));
            }
        }
    }
}

function add_minion(state,belong,name,type,status,direction,loc_x,loc_y){
    /* Merge Recover in here */
    if(parseInt(status) <= 0){
        // this minion no need to recover
    }
    else {
        var unit_pieces = 100;
        switch (type) {
            // Siege devices
            case 'sgram':
                /* Summon new sgram car */
                var sgram = new SGRAM(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                sgram.change_direction(parseInt(direction));
                sgram.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                sgram.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                if(state == 1){
                    sgram.set_status(status);
                }
                main_stage.addChild(sgram.obj);
                main_stage.addChild(sgram.hp);
                minion.push(sgram);
                break;
            // Elf force
            case 'elf_archer':
                var elf_archer = new ELF_ARCHER(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                elf_archer.change_direction(parseInt(direction));
                elf_archer.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                elf_archer.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                if(state == 1){
                    elf_archer.set_status(status);
                }
                main_stage.addChild(elf_archer.obj);
                main_stage.addChild(elf_archer.hp);
                minion.push(elf_archer);
                break;
            case 'elf_wisp':
                var elf_wisp = new ELF_WISP(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                elf_wisp.change_direction(parseInt(direction));
                elf_wisp.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                elf_wisp.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                if(state == 1){
                    elf_wisp.set_status(status);
                }
                main_stage.addChild(elf_wisp.obj);
                main_stage.addChild(elf_wisp.hp);
                minion.push(elf_wisp);
                break;
            case 'elf_giant':
                var elf_giant = new ELF_ROCK_GIANT(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                elf_giant.change_direction(parseInt(direction));
                elf_giant.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                elf_giant.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                if(state == 1){
                    elf_giant.set_status(status);
                }
                main_stage.addChild(elf_giant.obj);
                main_stage.addChild(elf_giant.hp);
                minion.push(elf_giant);
                break;
            case 'elf_dancer':
                console.log("Dancer show==============================================");
                var elf_dancer = new ELF_DANCER(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                elf_dancer.change_direction(parseInt(direction));
                elf_dancer.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                elf_dancer.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                if(state == 1){
                    elf_dancer.set_status(status);
                }
                main_stage.addChild(elf_dancer.obj);
                main_stage.addChild(elf_dancer.hp);
                minion.push(elf_dancer);
                break;
            // Human force
            case 'human_thief':
                var human_thief = new HUMAN_THIEF(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                human_thief.change_direction(parseInt(direction));
                human_thief.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                human_thief.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                if(state == 1){
                    human_thief.set_status(status);
                }
                main_stage.addChild(human_thief.obj);
                main_stage.addChild(human_thief.hp);
                minion.push(human_thief);
                break;
            case 'human_knight':
                var human_knight = new HUMAN_KNIGHT(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                human_knight.change_direction(parseInt(direction));
                human_knight.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                human_knight.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                if(state == 1){
                    human_knight.set_status(status);
                }
                main_stage.addChild(human_knight.obj);
                main_stage.addChild(human_knight.hp);
                minion.push(human_knight);
            break;
            case 'human_priest':
                var human_priest = new HUMAN_PRIEST(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                human_priest.change_direction(parseInt(direction));
                human_priest.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                human_priest.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                if(state == 1){
                    human_priest.set_status(status);
                }
                main_stage.addChild(human_priest.obj);
                main_stage.addChild(human_priest.hp);
                minion.push(human_priest);
            break;
            case 'human_piper':
                var human_piper = new HUMAN_PIPER(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                human_piper.change_direction(parseInt(direction));
                human_piper.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                human_piper.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                if(state == 1){
                    human_piper.set_status(status);
                }
                main_stage.addChild(human_piper.obj);
                main_stage.addChild(human_piper.hp);
                minion.push(human_piper);
            break;
            // Undead force
            case 'undead_samurai':
                var undead_samurai = new UNDEAD_SAMURAI(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                undead_samurai.change_direction(parseInt(direction));
                undead_samurai.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                undead_samurai.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                if(state == 1){
                    undead_samurai.set_status(status);
                }
                main_stage.addChild(undead_samurai.obj);
                main_stage.addChild(undead_samurai.hp);
                minion.push(undead_samurai);
            break;
            case 'undead_alchemist':
                var undead_alchemist = new UNDEAD_ALCHEMIST(x_unit,y_unit,name,max_w,max_h,belong,loc_x,loc_y);
                undead_alchemist.change_direction(parseInt(direction));
                undead_alchemist.set_basicV(x_unit/unit_pieces,y_unit/unit_pieces);
                undead_alchemist.setpos(x_unit*parseInt(loc_x),y_unit*parseInt(loc_y));
                if(state == 1){
                    undead_alchemist.set_status(status);
                }
                main_stage.addChild(undead_alchemist.obj);
                main_stage.addChild(undead_alchemist.hp);
                minion.push(undead_alchemist);
            break;
            default:

        }
    }

}
