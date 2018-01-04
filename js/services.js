angular.module('app.services', [])
.factory('services', [function(){

    var stats = [];
    var data = [];

    function resetData(){
        stats = [];
        data = [];
    }

    function getJSON(){
        for(var i = 0; i < 100; i++){
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
        stats.push({name:player, played:0, pTown:null, pPR:null, pWin:null, pTownWin:null, pMafiaWin:null, n0:0, n0_save:0,
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
                if(data[i].n0[0] == stats[j].name){
                    stats[j].n0++;
                    count++;
                }
                if(data[i].n0[1] == stats[j].name){
                    stats[j].n0++;
                    count++;
                }
                if(count == data[i].n0.length){
                    break;
                }
            }
        }
    };

    function getN0Save(){
        for(var i = 0; i < data.length; i++){
            for(var j = 0; j < stats.length; j++){
                if(data[i].n0_save == stats[j].name){
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
                if(data[i].shot == stats[x].name){
                    if(data[i].shot == data[i].cop || data[i].shot == data[i].medic || data[i].shot == data[i].vigilante){
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
                        if(data[i].shot == data[i].vanilla_town[y]){
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
                        if(data[i].shot == data[i].mafia[y]){
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
    };

    function getWinLossPlayed(){
        for(var i = 0; i < data.length; i++){
            for(var j = 0; j < stats.length; j++){
                for(var a = 0; a < data[i].vanilla_town.length; a++){
                    if(data[i].winner == "Town"){
                        if(data[i].vanilla_town[a] == stats[j].name){
                            if(data[i].n0[0] == data[i].vanilla_town[a] && data[i].n0[1] == data[i].vanilla_town[a] && data[i].n0_save == data[i].vanilla_town[a]){
                                stats[j].played++;
                                break;
                            }else if((data[i].n0[0] == data[i].vanilla_town[a] || data[i].n0[1] == data[i].vanilla_town[a]) && data[i].n0_save != data[i].vanilla_town[a]){
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
                            if(data[i].n0[0] == data[i].vanilla_town[a] && data[i].n0[1] == data[i].vanilla_town[a] && data[i].n0_save == data[i].vanilla_town[a]){
                                stats[j].played++;
                                break;
                            }else if((data[i].n0[0] == data[i].vanilla_town[a] || data[i].n0[1] == data[i].vanilla_town[a]) && data[i].n0_save != data[i].vanilla_town[a]){
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
                        if(data[i].n0[0] == data[i].cop && data[i].n0[1] == data[i].cop && data[i].n0_save == data[i].cop){
                            stats[j].played++;
                        }else if((data[i].n0[0] == data[i].cop || data[i].n0[1] == data[i].cop) && data[i].n0_save != data[i].cop){
                            stats[j].played++;
                        }else{
                            stats[j].played++;
                            stats[j].win_town++;
                        }
                    }
                    if(data[i].medic == stats[j].name){
                        if(data[i].n0[0] == data[i].medic && data[i].n0[1] == data[i].medic && data[i].n0_save == data[i].medic){
                            stats[j].played++;
                        }else if((data[i].n0[0] == data[i].medic || data[i].n0[1] == data[i].medic) && data[i].n0_save != data[i].medic){
                            stats[j].played++;
                        }else{
                            stats[j].played++;
                            stats[j].win_town++;
                        }
                    }
                    if(data[i].vigilante == stats[j].name){
                        if(data[i].n0[0] == data[i].vigilante && data[i].n0[1] == data[i].vigilante && data[i].n0_save == data[i].vigilante){
                            stats[j].played++;
                        }else if((data[i].n0[0] == data[i].vigilante || data[i].n0[1] == data[i].vigilante) && data[i].n0_save != data[i].vigilante){
                            stats[j].played++;
                        }else{
                            stats[j].played++;
                            stats[j].win_town++;
                        }
                    }
                }else if(data[i].winner == "Mafia"){
                    if(data[i].cop == stats[j].name){
                        if(data[i].n0[0] == data[i].cop && data[i].n0[1] == data[i].cop && data[i].n0_save == data[i].cop){
                            stats[j].played++;
                        }else if((data[i].n0[0] == data[i].cop || data[i].n0[1] == data[i].cop) && data[i].n0_save != data[i].cop){
                            stats[j].played++;
                        }else{
                            stats[j].played++;
                            stats[j].loss_town++;
                        }
                    }
                    if(data[i].medic == stats[j].name){
                        if(data[i].n0[0] == data[i].medic && data[i].n0[1] == data[i].medic && data[i].n0_save == data[i].medic){
                            stats[j].played++;
                        }else if((data[i].n0[0] == data[i].medic || data[i].n0[1] == data[i].medic) && data[i].n0_save != data[i].medic){
                            stats[j].played++;
                        }else{
                            stats[j].played++;
                            stats[j].loss_town++;
                        }
                    }
                    if(data[i].vigilante == stats[j].name){
                        if(data[i].n0[0] == data[i].vigilante && data[i].n0[1] == data[i].vigilante && data[i].n0_save == data[i].vigilante){
                            stats[j].played++;
                        }else if((data[i].n0[0] == data[i].vigilante || data[i].n0[1] == data[i].vigilante) && data[i].n0_save != data[i].vigilante){
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
                            if(data[i].n0[0] == stats[a].n0_kills[b].name || data[i].n0[1] == stats[a].n0_kills[b].name){
                                if(data[i].n0[0] == stats[a].n0_kills[b].name && data[i].n0[1] == stats[a].n0_kills[b].name)
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

    function getPTown(){
        for(var i = 0; i < stats.length; i++){
            var mafia = stats[i].win_mafia + stats[i].loss_mafia;
            var town = stats[i].played - mafia;
            var total = mafia + town;
            stats[i].pTown = ((town / total) * 100).toFixed(2);
        }
    };

    function getPPR(){
        for(var i = 0; i < stats.length; i++){
            var pr = stats[i].roll_cop + stats[i].roll_medic + stats[i].roll_vigi;
            var total = stats[i].played;
            stats[i].pPR = ((pr / total) * 100).toFixed(2);
        }
    };

    function getPWin(){
        for(var i = 0; i < stats.length; i++){
            var win = stats[i].win_town + stats[i].win_mafia;
            var loss = stats[i].loss_town + stats[i].loss_mafia;
            var total = win + loss;
            if(total != 0){
                stats[i].pWin = ((win / total) * 100).toFixed(2);
            }
        }
    };

    function getPTownWin(){
        for(var i = 0; i < stats.length; i++){
            var win = stats[i].win_town;
            var loss = stats[i].loss_town;
            var total = win + loss;
            if(total != 0){
                stats[i].pTownWin = ((win / total) * 100).toFixed(2);
            }
        }
    };

    function getPMafiaWin(){
        for(var i = 0; i < stats.length; i++){
            var win = stats[i].win_mafia;
            var loss = stats[i].loss_mafia;
            var total = win + loss;
            if(total != 0){
                stats[i].pMafiaWin = ((win / total) * 100).toFixed(2);
            }
        }
    };

    function getPKilled(){
        for(var i = 0; i < stats.length; i++){
            for(var j = 0; j < stats[i].n0_kills.length; j++){
                var killed = stats[i].n0_kills[j].killed;
                var total = stats[i].n0_kills[j].total;
                stats[i].n0_kills[j].pKilled = ((killed / total) * 100).toFixed(2);
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
        getPTown();
        getPPR();
        getPWin();
        getPTownWin();
        getPMafiaWin();
        getPKilled();
        stats.sort(byPlayedName);
        for(var i = 0; i < stats.length; i++)
            stats[i].n0_kills.sort(byPKilled);
        return stats;
    };

    function getKills(id){
        for(var i = 0; i < stats.length; i++)
            if(id == stats[i].name)
                return stats[i].n0_kills;
        return stats[0].n0_kills;
    }

    return{
        getData, getKills
    };

}]);