angular.module('app.services', [])
.factory('services', [function(){

    var data = [];
    var stats = [];
    var gStats = {};

    function resetData(){
        data = [];
        stats = [];
        gStats = {g1_town:0, g1_mafia:0, g2_town:0, g2_mafia:0, pG:null, pG1:null, pG2:null,
                    g1_sleep1:0, g1_sleep2:0, g2_sleep1:0, g2_sleep2:0};
    };

    function getJSON(){
        for(var i = 0; i < 16; i++){
            var ourRequest = new XMLHttpRequest();
            var num = (i+1);
            var URL = 'data/' + num + '.json'
            ourRequest.open('GET', URL, false);
            ourRequest.onload = function(){
                data[i] = JSON.parse(ourRequest.responseText);
            };
            ourRequest.send();
        }
    };

    function getPlayers(){
        for(var i = 0; i < data.length; i++){
            for(var j = 0; j < data[i].mafia.length; j++){
                var found = false;
                for(var x = 0; x < stats.length; x++){
                    if(stats[x].name == data[i].mafia[j]){
                        getTargets(x, i);
                        found = true;
                        break;
                    }
                }
                if(!found){
                    addPlayer(data[i].mafia[j]);
                    getTargets(stats.length-1, i);
                }
            }
            for(var j = 0; j < data[i].vanilla_town.length; j++){
                var found = false;
                for(var x = 0; x < stats.length; x++){
                    if(stats[x].name == data[i].vanilla_town[j]){
                        found = true;
                        break;
                    }
                }
                if(!found){
                    addPlayer(data[i].vanilla_town[j]);
                }
            }
            var cop = false;
            for(var x = 0; x < stats.length; x++){
                if(stats[x].name == data[i].cop){
                    cop = true;
                    break;
                }
            }
            if(!cop){
                addPlayer(data[i].cop);
            }
            var medic = false;
            for(var x = 0; x < stats.length; x++){
                if(stats[x].name == data[i].medic){
                    medic = true;
                    break;
                }
            }
            if(!medic){
                addPlayer(data[i].medic);
            }
            var vigilante = false;
            for(var x = 0; x < stats.length; x++){
                if(stats[x].name == data[i].vigilante){
                    vigilante = true;
                    break;
                }
            }
            if(!vigilante){
                addPlayer(data[i].vigilante);
            }
        }
    };

    function addPlayer(player){
        stats.push({name:player, played:0, pTown:null, pPR:null, pWin:null, pTownWin:null, pMafiaWin:null, aDays:null, days:0, n0:0, n0_save:0,
                    lynch_mafia:0, lynch_vt:0, lynch_pr:0, shot_mafia:0, shot_vt:0, shot_pr:0, vigi_hit:0, vigi_miss:0, 
                    f3_win:0, f3_loss:0, roll_cop:0, roll_medic:0, roll_vigi:0, win_town:0, loss_town:0, win_mafia:0, loss_mafia:0,
                    n0_kills:[]});
    };

    function getTargets(x, i){
        for(var a = 0; a < data[i].vanilla_town.length; a++){
            var found = false;
            for(var b = 0; b < stats[x].n0_kills.length; b++){
                if(data[i].vanilla_town[a] == stats[x].n0_kills[b].name){
                    found = true;
                    break;
                }
            }
            if(!found){
                addTarget(data[i].vanilla_town[a], x, i);
            }
        }
        var cop = false;
        for(var a = 0; a < stats[x].n0_kills.length; a++){
            if(stats[x].n0_kills[a].name == data[i].cop){
                cop = true;
                break;
            }
        }
        if(!cop){
            addTarget(data[i].cop, x, i);
        }
        var medic = false;
        for(var a = 0; a < stats[x].n0_kills.length; a++){
            if(stats[x].n0_kills[a].name == data[i].medic){
                medic = true;
                break;
            }
        }
        if(!medic){
            addTarget(data[i].medic, x, i);
        }
        var vigilante = false;
        for(var a = 0; a < stats[x].n0_kills.length; a++){
            if(stats[x].n0_kills[a].name == data[i].vigilante){
                vigilante = true;
                break;
            }
        }
        if(!vigilante){
            addTarget(data[i].vigilante, x, i);
        }
    };

    function addTarget(player, x, i){
        stats[x].n0_kills.push({name:player, pKilled:null, killed:0, total:0});
    }

    function getRollCop(){
        for(var i = 0; i < data.length; i++){
            for(var j = 0; j < stats.length; j++){
                if(data[i].cop == stats[j].name){
                    stats[j].roll_cop++;
                    break;
                }
            }
        }
    };

    function getRollMedic(){
        for(var i = 0; i < data.length; i++){
            for(var j = 0; j < stats.length; j++){
                if(data[i].medic == stats[j].name){
                    stats[j].roll_medic++;
                    break;
                }
            }
        }
    };

    function getRollVigi(){
        for(var i = 0; i < data.length; i++){
            for(var j = 0; j < stats.length; j++){
                if(data[i].vigilante == stats[j].name){
                    stats[j].roll_vigi++;
                    break;
                }
            }
        }
    };

    function getN0(){
        for(var i = 0; i < data.length; i++){
            var count = 0;
            for(var j = 0; j < stats.length; j++){
                if(data[i].kill[0][0] == stats[j].name){
                    stats[j].n0++;
                    count++;
                }
                if(data[i].kill[0][1] == stats[j].name){
                    stats[j].n0++;
                    count++;
                }
                if(count == data[i].kill[0].length){
                    break;
                }
            }
        }
    };

    function getN0Save(){
        for(var i = 0; i < data.length; i++){
            for(var j = 0; j < stats.length; j++){
                if(data[i].save[0] == stats[j].name){
                    stats[j].n0_save++;
                    break;
                }
            }
        }
    };

    function getLynched(){
        for(var i = 0; i < data.length; i++){
            for(var j = 0; j < data[i].lynched.length; j++){
                for(var x = 0; x < stats.length; x++){
                    if(data[i].lynched[j] == stats[x].name){
                        if(data[i].lynched[j] == data[i].cop || data[i].lynched[j] == data[i].medic || data[i].lynched[j] == data[i].vigilante){
                            stats[x].lynch_pr++;
                            break;
                        }
                        for(var y = 0; y < data[i].vanilla_town.length; y++){
                            if(data[i].lynched[j] == data[i].vanilla_town[y]){
                                stats[x].lynch_vt++;
                                break;
                            }
                        }
                        for(var y = 0; y < data[i].mafia.length; y++){
                            if(data[i].lynched[j] == data[i].mafia[y]){
                                stats[x].lynch_mafia++;
                                break;
                            }
                        }
                    }
                }
            }
        }
    };

    function getVigiShot(){
        for(var i = 0; i < data.length; i++){
            for(var x = 0; x < stats.length; x++){
                if(data[i].shot[data[i].shot.length-1] == stats[x].name){
                    if(data[i].shot[data[i].shot.length-1] == data[i].cop || data[i].shot[data[i].shot.length-1] == data[i].medic || data[i].shot[data[i].shot.length-1] == data[i].vigilante){
                        stats[x].shot_pr++;
                        for(var a = 0; a < stats.length; a++){
                            if(data[i].vigilante == stats[a].name){
                                stats[a].vigi_miss++;
                                break;
                            }
                        }
                        break;
                    }
                    for(var y = 0; y < data[i].vanilla_town.length; y++){
                        if(data[i].shot[data[i].shot.length-1] == data[i].vanilla_town[y]){
                            stats[x].shot_vt++;
                            for(var a = 0; a < stats.length; a++){
                                if(data[i].vigilante == stats[a].name){
                                    stats[a].vigi_miss++;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    for(var y = 0; y < data[i].mafia.length; y++){
                        if(data[i].shot[data[i].shot.length-1] == data[i].mafia[y]){
                            stats[x].shot_mafia++;
                            for(var a = 0; a < stats.length; a++){
                                if(data[i].vigilante == stats[a].name){
                                    stats[a].vigi_hit++;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
    };

    function getF3WinLoss(){
        for(var i = 0; i < data.length; i++){
            for(var j = 0; j < stats.length; j++){
                if(data[i].f3_win != null && data[i].f3_loss != null){
                    for(var x = 0; x < data[i].f3_win.length; x++){
                        if(data[i].f3_win[x] == stats[j].name){
                            stats[j].f3_win++;
                            break;
                        }
                    }
                    for(var x = 0; x < data[i].f3_loss.length; x++){
                        if(data[i].f3_loss[x] == stats[j].name){
                            stats[j].f3_loss++;
                            break;
                        }
                    }
                }
            }
        }
    };

    function getWinLossPlayed(){
        for(var i = 0; i < data.length; i++){
            for(var j = 0; j < stats.length; j++){
                for(var a = 0; a < data[i].vanilla_town.length; a++){
                    if(data[i].winner == "Town"){
                        if(data[i].vanilla_town[a] == stats[j].name){
                            if(data[i].kill[0][0] == data[i].vanilla_town[a] && data[i].kill[0][1] == data[i].vanilla_town[a] && data[i].save[0] == data[i].vanilla_town[a]){
                                stats[j].played++;
                                break;
                            }else if((data[i].kill[0][0] == data[i].vanilla_town[a] || data[i].kill[0][1] == data[i].vanilla_town[a]) && data[i].save[0] != data[i].vanilla_town[a]){
                                stats[j].played++;
                                break;
                            }else{
                                stats[j].played++;
                                stats[j].win_town++;
                                break;
                            }
                        }
                    }else if(data[i].winner == "Mafia"){
                        if(data[i].vanilla_town[a] == stats[j].name){
                            if(data[i].kill[0][0] == data[i].vanilla_town[a] && data[i].kill[0][1] == data[i].vanilla_town[a] && data[i].save[0] == data[i].vanilla_town[a]){
                                stats[j].played++;
                                break;
                            }else if((data[i].kill[0][0] == data[i].vanilla_town[a] || data[i].kill[0][1] == data[i].vanilla_town[a]) && data[i].save[0] != data[i].vanilla_town[a]){
                                stats[j].played++;
                                break;
                            }else{
                                stats[j].played++;
                                stats[j].loss_town++;
                                break;
                            }
                        }
                    }
                }
                for(var a = 0; a < data[i].mafia.length; a++){
                    if(data[i].winner == "Town"){
                        if(data[i].mafia[a] == stats[j].name){
                            stats[j].played++;
                            stats[j].loss_mafia++;
                            break;
                        }
                    }else if(data[i].winner == "Mafia"){
                        if(data[i].mafia[a] == stats[j].name){
                            stats[j].played++;
                            stats[j].win_mafia++;
                            break;
                        }
                    }
                }
                if(data[i].winner == "Town"){
                    if(data[i].cop == stats[j].name){
                        if(data[i].kill[0][0] == data[i].cop && data[i].kill[0][1] == data[i].cop && data[i].save[0] == data[i].cop){
                            stats[j].played++;
                        }else if((data[i].kill[0][0] == data[i].cop || data[i].kill[0][1] == data[i].cop) && data[i].save[0] != data[i].cop){
                            stats[j].played++;
                        }else{
                            stats[j].played++;
                            stats[j].win_town++;
                        }
                    }
                    if(data[i].medic == stats[j].name){
                        if(data[i].kill[0][0] == data[i].medic && data[i].kill[0][1] == data[i].medic && data[i].save[0] == data[i].medic){
                            stats[j].played++;
                        }else if((data[i].kill[0][0] == data[i].medic || data[i].kill[0][1] == data[i].medic) && data[i].save[0] != data[i].medic){
                            stats[j].played++;
                        }else{
                            stats[j].played++;
                            stats[j].win_town++;
                        }
                    }
                    if(data[i].vigilante == stats[j].name){
                        if(data[i].kill[0][0] == data[i].vigilante && data[i].kill[0][1] == data[i].vigilante && data[i].save[0] == data[i].vigilante){
                            stats[j].played++;
                        }else if((data[i].kill[0][0] == data[i].vigilante || data[i].kill[0][1] == data[i].vigilante) && data[i].save[0] != data[i].vigilante){
                            stats[j].played++;
                        }else{
                            stats[j].played++;
                            stats[j].win_town++;
                        }
                    }
                }else if(data[i].winner == "Mafia"){
                    if(data[i].cop == stats[j].name){
                        if(data[i].kill[0][0] == data[i].cop && data[i].kill[0][1] == data[i].cop && data[i].save[0] == data[i].cop){
                            stats[j].played++;
                        }else if((data[i].kill[0][0] == data[i].cop || data[i].kill[0][1] == data[i].cop) && data[i].save[0] != data[i].cop){
                            stats[j].played++;
                        }else{
                            stats[j].played++;
                            stats[j].loss_town++;
                        }
                    }
                    if(data[i].medic == stats[j].name){
                        if(data[i].kill[0][0] == data[i].medic && data[i].kill[0][1] == data[i].medic && data[i].save[0] == data[i].medic){
                            stats[j].played++;
                        }else if((data[i].kill[0][0] == data[i].medic || data[i].kill[0][1] == data[i].medic) && data[i].save[0] != data[i].medic){
                            stats[j].played++;
                        }else{
                            stats[j].played++;
                            stats[j].loss_town++;
                        }
                    }
                    if(data[i].vigilante == stats[j].name){
                        if(data[i].kill[0][0] == data[i].vigilante && data[i].kill[0][1] == data[i].vigilante && data[i].save[0] == data[i].vigilante){
                            stats[j].played++;
                        }else if((data[i].kill[0][0] == data[i].vigilante || data[i].kill[0][1] == data[i].vigilante) && data[i].save[0] != data[i].vigilante){
                            stats[j].played++;
                        }else{
                            stats[j].played++;
                            stats[j].loss_town++;
                        }
                    }
                }
            }
        }
    };

    function getN0_Kills(){
        for(var i = 0; i < data.length; i++){
            for(var j = 0; j < data[i].mafia.length; j++){
                for(var a = 0; a < stats.length; a++){
                    if(data[i].mafia[j] == stats[a].name){
                        for(var b = 0; b < stats[a].n0_kills.length; b++){
                            if(data[i].kill[0][0] == stats[a].n0_kills[b].name || data[i].kill[0][1] == stats[a].n0_kills[b].name){
                                if(data[i].kill[0][0] == stats[a].n0_kills[b].name && data[i].kill[0][1] == stats[a].n0_kills[b].name)
                                    stats[a].n0_kills[b].killed++;
                                stats[a].n0_kills[b].killed++;
                            }
                            if(data[i].cop == stats[a].n0_kills[b].name)
                                stats[a].n0_kills[b].total++;
                            if(data[i].medic == stats[a].n0_kills[b].name)
                                stats[a].n0_kills[b].total++;
                            if(data[i].vigilante == stats[a].n0_kills[b].name)
                                stats[a].n0_kills[b].total++;
                            for(var c = 0; c < data[i].vanilla_town.length; c++){
                                if(data[i].vanilla_town[c] == stats[a].n0_kills[b].name){
                                    stats[a].n0_kills[b].total++;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
    };

    function getDaysAlive(){
        for(var i = 0; i < data.length; i++){
            var players = [];
            var days = data[i].lynched.length;
            players.push({name:data[i].cop, killed:days});
            players.push({name:data[i].medic, killed:days});
            players.push({name:data[i].vigilante, killed:days});
            for(var j = 0; j < data[i].vanilla_town.length; j++)
                players.push({name:data[i].vanilla_town[j], killed:days});
            for(var j = 0; j < data[i].mafia.length; j++)
                players.push({name:data[i].mafia[j], killed:days});
            for(var j = 0; j < data[i].lynched.length; j++)
                for(var x = 0; x < players.length; x++)
                    if(players[x].name == data[i].lynched[j])
                        players[x].killed = j+1;
            for(var j = 0; j < data[i].kill.length; j++)
                for(var k = 0; k < 2; k++)
                    for(var x = 0; x < players.length; x++)
                        if(data[i].kill[j].length == 2 && (data[i].kill[j][0].length != 1 || data[i].kill[j][1].length != 1)){
                            if(players[x].name == data[i].kill[j][k])
                                if(players[x].name != data[i].save[j])
                                    players[x].killed = j;
                                else
                                    if(data[i].kill[j][0] == data[i].kill[j][1])
                                        players[x].killed = j;
                        }else
                            if(players[x].name == data[i].kill[j])
                                if(players[x].name != data[i].save[j])
                                    players[x].killed = j;                        
            for(var x = 0; x < players.length; x++)
                if(players[x].name == data[i].shot[data[i].shot.length-1])
                    if(players[x].name != data[i].save[data[i].shot.length-1])
                        players[x].killed = data[i].shot.length-1;
                    else
                        if(data[i].kill[data[i].shot.length-1].length == 2 && (data[i].kill[data[i].shot.length-1][0].length != 1 || data[i].kill[data[i].shot.length-1][1].length != 1)){
                            if(players[x].name == data[i].kill[data[i].shot.length-1][0] || players[x].name == data[i].kill[data[i].shot.length-1][1])
                                players[x].killed = data[i].shot.length-1;
                        }else
                            if(players[x].name == data[i].kill[data[i].shot.length-1])
                                players[x].killed = data[i].shot.length-1;
            for(var j = 0; j < stats.length; j++)
                for(var x = 0; x < players.length; x++)
                    if(stats[j].name == players[x].name)
                        stats[j].days += players[x].killed;
        }
    };

    function getADays(){
        for(var i = 0; i < stats.length; i++){
            var days = stats[i].days;
            var games = stats[i].played;
            stats[i].aDays = (days / games).toFixed(1);
        }
    };

    function getPTown(){
        for(var i = 0; i < stats.length; i++){
            var mafia = stats[i].win_mafia + stats[i].loss_mafia;
            var town = stats[i].played - mafia;
            var total = mafia + town;
            stats[i].pTown = ((town / total) * 100).toFixed() + ' %';
        }
    };

    function getPPR(){
        for(var i = 0; i < stats.length; i++){
            var pr = stats[i].roll_cop + stats[i].roll_medic + stats[i].roll_vigi;
            var total = stats[i].played;
            stats[i].pPR = ((pr / total) * 100).toFixed() + ' %';
        }
    };

    function getPWin(){
        for(var i = 0; i < stats.length; i++){
            var win = stats[i].win_town + stats[i].win_mafia;
            var loss = stats[i].loss_town + stats[i].loss_mafia;
            var total = win + loss;
            if(total != 0){
                stats[i].pWin = ((win / total) * 100).toFixed() + ' %';
            }
        }
    };

    function getPTownWin(){
        for(var i = 0; i < stats.length; i++){
            var win = stats[i].win_town;
            var loss = stats[i].loss_town;
            var total = win + loss;
            if(total != 0){
                stats[i].pTownWin = ((win / total) * 100).toFixed() + ' %';
            }
        }
    };

    function getPMafiaWin(){
        for(var i = 0; i < stats.length; i++){
            var win = stats[i].win_mafia;
            var loss = stats[i].loss_mafia;
            var total = win + loss;
            if(total != 0){
                stats[i].pMafiaWin = ((win / total) * 100).toFixed() + ' %';
            }
        }
    };

    function getPKilled(){
        for(var i = 0; i < stats.length; i++){
            for(var j = 0; j < stats[i].n0_kills.length; j++){
                var killed = stats[i].n0_kills[j].killed;
                var total = stats[i].n0_kills[j].total;
                stats[i].n0_kills[j].pKilled = ((killed / total) * 100).toFixed();
            }
        }
    };

    function validateNames(){
        for(var i = 0; i < data.length; i++){
            var players = [];
            players.push(data[i].cop);
            players.push(data[i].medic);
            players.push(data[i].vigilante);
            for(var j = 0; j < data[i].vanilla_town.length; j++)
                players.push(data[i].vanilla_town[j]);
            for(var j = 0; j < data[i].mafia.length; j++)
                players.push(data[i].mafia[j]);
            for(var x = 0; x < data[i].kill.length; x++){
                for(var y = 0; y < 2; y++){
                    if(data[i].kill[x].length == 2 && (data[i].kill[x][0].length != 1 || data[i].kill[x][1].length != 1)){
                        var found = false;
                        for(var a = 0; a < players.length; a++)
                            if(players[a] == data[i].kill[x][y])
                                found = true;
                        if(!found)
                            console.log('NAME ERROR: Game ' + (i+1) + ' kill [' + x + '][' + y + ']');
                    }else{
                        var found = false;
                        for(var a = 0; a < players.length; a++)
                            if(players[a] == data[i].kill[x])
                                found = true;
                        if(!found)
                            console.log('NAME ERROR: Game ' + (i+1) + ' kill [' + x + ']');
                    }
                }
            }
            for(var x = 0; x < data[i].check.length; x++){
                var found = false;
                for(var a = 0; a < players.length; a++){
                    if(players[a] == data[i].check[x]){
                        found = true;
                        break;
                    }
                }
                if(!found)
                    console.log('NAME ERROR: Game ' + (i+1) + ' check [' + x + ']');
            }
            for(var x = 0; x < data[i].save.length; x++){
                var found = false;
                for(var a = 0; a < players.length; a++){
                    if(players[a] == data[i].save[x]){
                        found = true;
                        break;
                    }
                }
                if(!found)
                    console.log('NAME ERROR: Game ' + (i+1) + ' save [' + x + ']');
            }
            for(var x = 0; x < data[i].shot.length; x++){
                var found = false;
                for(var a = 0; a < players.length; a++){
                    if(players[a] == data[i].shot[x] || data[i].shot[x] == 'NONE'){
                        found = true;
                        break;
                    }
                }
                if(!found)
                    console.log('NAME ERROR: Game ' + (i+1) + ' shot [' + x + ']');
            }
            for(var x = 0; x < data[i].lynched.length; x++){
                var found = false;
                for(var a = 0; a < players.length; a++){
                    if(players[a] == data[i].lynched[x] || data[i].lynched[x] == 'SLEEP'){
                        found = true;
                        break;
                    }
                }
                if(!found)
                    console.log('NAME ERROR: Game ' + (i+1) + ' lynched [' + x + ']');
            }
            if(data[i].f3_win != null){
                for(var x = 0; x < data[i].f3_win.length; x++){
                    var found = false;
                    for(var a = 0; a < players.length; a++){
                        if(players[a] == data[i].f3_win[x]){
                            found = true;
                            break;
                        }
                    }
                    if(!found)
                        console.log('NAME ERROR: Game ' + (i+1) + ' f3_win [' + x + ']');
                }
            }
            if(data[i].f3_loss != null){
                for(var x = 0; x < data[i].f3_loss.length; x++){
                    var found = false;
                    for(var a = 0; a < players.length; a++){
                        if(players[a] == data[i].f3_loss[x]){
                            found = true;
                            break;
                        }
                    }
                    if(!found)
                        console.log('NAME ERROR: Game ' + (i+1) + ' f3_loss [' + x + ']');
                }
            }
        }
    };

    function byPlayedName(a,b){
        if(a.played > b.played)
            return -1;
        if(a.played < b.played)
            return 1;
        if(a.name < b.name)
            return -1;
        if(a.name > b.name)
            return 1;
        return 0;
    };

    function byPKilled(a,b){
        return b.pKilled - a.pKilled || b.killed - a.killed || a.total - b.total;
    };

    function getData(){
        resetData();
        getJSON();
        getPlayers();
        getRollCop();
        getRollMedic();
        getRollVigi();
        getN0();
        getN0Save();
        getLynched();
        getVigiShot();
        getF3WinLoss();
        getWinLossPlayed();
        getN0_Kills();
        getDaysAlive();
        getADays();
        getPTown();
        getPPR();
        getPWin();
        getPTownWin();
        getPMafiaWin();
        getPKilled();
        validateNames();
        stats.sort(byPlayedName);
        return stats;
    };

    function getGData(){
        for(var i = 0; i < data.length; i++){
            if(data[i].winner == 'Town')
                if(i % 2 == 0)
                    gStats.g1_town++;
                else
                    gStats.g2_town++;
            if(data[i].winner == 'Mafia')
                if(i % 2 == 0)
                    gStats.g1_mafia++;
                else
                    gStats.g2_mafia++;
            if(data[i].lynched[0] == 'SLEEP')
                if(i % 2 == 0)
                    gStats.g1_sleep1++;
                else
                    gStats.g2_sleep1++;
            if(data[i].lynched[1] == 'SLEEP')
                if(i % 2 == 0)
                    gStats.g1_sleep2++;
                else
                    gStats.g2_sleep2++;
        }
        var g1 = gStats.g1_town + gStats.g1_mafia;
        var g2 = gStats.g2_town + gStats.g2_mafia;
        var g = g1 + g2;
        gStats.pG1 = ((gStats.g1_town / g1) * 100).toFixed() + ' %';
        gStats.pG2 = ((gStats.g2_town / g2) * 100).toFixed() + ' %';
        gStats.pG = (((gStats.g1_town + gStats.g2_town) / g) * 100).toFixed() + ' %';
        return gStats;
    };

    function getKills(id){
        for(var i = 0; i < stats.length; i++)
            stats[i].n0_kills.sort(byPKilled);
        for(var i = 0; i < stats.length; i++)
            if(id == stats[i].name)
                return stats[i].n0_kills;
        return 0;
    };

    return{
        getData, getGData, getKills
    };

}]);