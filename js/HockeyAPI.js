function HockeyAPI() {
    this._URL = 'https://statsapi.web.nhl.com/api/v1/';
    this._Request = new XMLHttpRequest();
    this._NHL = 133;
}

/** @property {object} teams*/
HockeyAPI.prototype.getTeams = function() {
        this._Request.onload = function () {
            let teams = JSON.parse(this.responseText).teams;
            let teamSelector = document.getElementById('teamSelector');
            teams.sort(HockeyAPI.compareNames);
            teams.forEach(function (team) {
                let option = document.createElement('option');
                option.value = team.id;
                option.textContent = team.name;
                // default team selected is the Penguins
                if (team.id === 5) {
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
HockeyAPI.prototype.getRoster = function(teamId,set_default) {
        this._Request.onload = function () {
            let roster = JSON.parse(this.responseText).roster;
            let playerSelector = document.getElementById('playerSelector');
            roster.sort(HockeyAPI.comparefullNames);
            roster.forEach(function (player) {
                // console.log(player.fullName);
                let option = document.createElement('option');
                option.value = player.person.id;
                option.textContent = player.person.fullName;
                // default player selected is Crosby
                if (set_default && (player.person.id === 8471675)) {
                    option.selected = true;
                }
                playerSelector.appendChild(option);
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
