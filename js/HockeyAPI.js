function HockeyAPI() {
    this._URL = 'https://statsapi.web.nhl.com/api/v1/';
    this._Request = new XMLHttpRequest();
    this._NHL = 133;
}

/** @property {object} teams*/
HockeyAPI.prototype.getTeams = function(set_default) {
        this._Request.onload = function () {
            let teams = JSON.parse(this.responseText).teams;
            let teamSelector = document.getElementById('teamSelector');
            teams.sort(HockeyAPI.compareNames);
            teams.forEach(function (team) {
                let option = document.createElement('option');
                option.value = team.id;
                option.textContent = team.name;
                // default team selected set to:
                // penguins === 5
                // capitals === 15
                if (set_default && (team.id === 15)) {
                    option.selected = true;
                }
                teamSelector.appendChild(option);
                // console.log(team.name);
            });
        };
        this._Request.open('get', this._URL+'/teams', false);
        this._Request.send();
    };

/** @property {object} roster
 *  @property {object} person
 *  @property {string} fullName
 * */
HockeyAPI.prototype.getRoster = function(teamId, position, set_default) {
        this._Request.onload = function () {
            let roster = JSON.parse(this.responseText).roster;
            let playerSelector = document.getElementById('playerSelector');
            let positionCode = (position.localeCompare("2")===0) ? "G" : "S";
            roster.sort(HockeyAPI.comparefullNames);
            roster.forEach(function (player) {
                if ((positionCode.localeCompare("G")===0) && (player.position.code.localeCompare("G")===0) ) {
                    HockeyAPI.createPlayerOption(player, set_default, playerSelector);
                }
                else if ((positionCode.localeCompare("S")===0) && (player.position.code.localeCompare("G")!==0) ) {
                    HockeyAPI.createPlayerOption(player, set_default, playerSelector);
                }

            });
        };
        this._Request.open('get', this._URL+'/teams/'+teamId+'/roster', false);
        this._Request.send();
    };



    // https://stackoverflow.com/questions/5362462/how-can-i-make-xhr-onreadystatechange-return-its-result
HockeyAPI.prototype.getPlayerStats = function(playerId, jsonResponse) {
        this._Request.onload = function () {
            jsonResponse.setResponse(JSON.parse(this.responseText).stats[0]);
        };
        this._Request.open('get', this._URL+'people/'+playerId+'/stats?stats=yearByYear', false);
        this._Request.send();
    };

/**
 * @property {object} people
 * */
HockeyAPI.prototype.getPlayerInformation = function(playerId, jsonResponse) {
    this._Request.onload = function () {
        jsonResponse.setResponse(JSON.parse(this.responseText).people[0]);
    };
    this._Request.open('get', this._URL+'people/'+playerId, false);
    this._Request.send();
};

HockeyAPI.createPlayerOption = function(player, set_default, playerSelector) {
    // console.log(player.fullName);
    let option = document.createElement('option');
    option.value = player.person.id;
    option.textContent = player.person.fullName;
    // default player selection set to:
    // crosby === 8471675
    // ovi === 8471214
    if (set_default && (player.person.id === 8471214)) {
        option.selected = true;
    }
    playerSelector.appendChild(option);
};

HockeyAPI.compareNames = function(a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    };

HockeyAPI.comparefullNames = function(a, b) {
        let aName = a.person.fullName.split(" ")[1];
        let bName = b.person.fullName.split(" ")[1];
        if (aName < bName)
            return -1;
        if (aName > bName)
            return 1;
        return 0;
    };

HockeyAPI.prototype.getNHLId = function() {
        return this._NHL;
    };
