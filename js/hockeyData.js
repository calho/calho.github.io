let hockeyApi = new HockeyAPI();
let data = [];
let savedData = [];
let savedYears = [];

function initiatePage() {
    fillTeamSelector(true);
}

function fillTeamSelector(set_default = false) {
    hockeyApi.getTeams(set_default);

    fillPlayerSelector(set_default);

}

function clearCurrentPosition() {
    savedData = [];
    data = [];
    savedYears = [];

    // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    let compareList = document.getElementById("compares");
    while (compareList.firstChild) {
        compareList.removeChild(compareList.firstChild);
    }

    fillPlayerSelector();
}

function fillPlayerSelector(set_default = false ) {
    let teamSelector = document.getElementById('teamSelector');
    document.getElementById('playerSelector').options.length = 0;

    let positionSelector = document.getElementById('positionSelector');

    hockeyApi.getRoster(teamSelector.options[teamSelector.selectedIndex].value, positionSelector.options[positionSelector.selectedIndex].value, set_default);

    if (set_default) {
        fillStatSelector();
    }
    else {
        createGraph();
    }
}

/**
 * @property {object} splits
 * */
function fillStatSelector() {
    let playerSelector = document.getElementById('playerSelector');

    let season;

    while (true) {
        let selectedPlayer = playerSelector.options[playerSelector.selectedIndex];

        let jsonResponse = new JsonResponse();

        hockeyApi.getPlayerStats(selectedPlayer.value, jsonResponse);
        let response = jsonResponse.response.splits;

        season = findNHLLeague(response);

        if (season.hasOwnProperty('stat')) {
            break;
        }
    }


    let statSelector = document.getElementById('statSelector');
    statSelector.options.length = 0;

    // https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key

    if (season.hasOwnProperty('stat')) {
        // https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
        let statCategories = {};
        Object.keys(season.stat).sort().forEach(function(key) {
            statCategories[key] = season.stat[key];
        });

        for (let category in statCategories) {
            let option = document.createElement('option');
            option.value = category;
            //https://stackoverflow.com/questions/5582228/insert-space-before-capital-letters
            option.textContent = category.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z])/g, '$1 $2').trim();
            if (category === "points") {
                option.selected = true;
            }
            if (category === "savePercentage") {
                option.selected = true;
            }

            statSelector.appendChild(option);
        }
    }


    createGraph();
}

/**
 * @property {object} league
 * */
function checkNHLLeague(season) {
    return ((season.league.hasOwnProperty('id')) && (season.league.id === hockeyApi.getNHLId()));
}

function findNHLLeague(stat) {
    return stat.find(checkNHLLeague);
}

function getNewStats() {

    let statSelector =  document.getElementById('statSelector');
    let statCategory = statSelector.options[statSelector.selectedIndex].value;
    let statText = statSelector.options[statSelector.selectedIndex].text;

    let positionSelector = document.getElementById('positionSelector');
    let positionCode = (positionSelector.options[positionSelector.selectedIndex].value.localeCompare("2")===0) ? "G" : "S";

    savedData.forEach(function (player) {

        let jsonResponse = new JsonResponse();

        let statsData = createStatsData(player.id, jsonResponse, positionCode, statText, statCategory);

        player.y = statsData.season_stats;
        player.text = statsData.stat_description;
    });

    createGraph();
}

function createGraph() {

    let playerSelector = document.getElementById('playerSelector');
    let jsonResponse = new JsonResponse();

    let statsData = {};
    let yaxis = "";

    let selectedPlayer = playerSelector.options[playerSelector.selectedIndex];

    let repeatFlag = false;
    let compareList = document.getElementById('compares');

    compareList.childNodes.forEach(function (player) {
        if (player.id.localeCompare(selectedPlayer.value) === 0) {
            repeatFlag = true;
        }
    });

    let positionSelector = document.getElementById('positionSelector');
    let positionCode = (positionSelector.options[positionSelector.selectedIndex].value.localeCompare("2")===0) ? "G" : "S";

    let statSelector =  document.getElementById('statSelector');
    let statCategory = statSelector.options[statSelector.selectedIndex].value;
    let statText = statSelector.options[statSelector.selectedIndex].text;

    if (!repeatFlag) {

        statsData = createStatsData(selectedPlayer.value, jsonResponse, positionCode, statText, statCategory);

        let trace = {
            x: statsData.season_year,
            y: statsData.season_stats,
            text: statsData.stat_description,
            name: selectedPlayer.text,
            type: 'scatter',
            id: selectedPlayer.value
        };

        yaxis = statsData.yaxis;

        data = [trace];
    }
    else {

        if (positionCode.localeCompare("G") === 0) {
            yaxis = statText;
        }
        else {
            yaxis = statText + " Per Game";
        }
            data = [];
    }


    // https://plot.ly/javascript/responsive-fluid-layout/
    let d3 = Plotly.d3;

    let WIDTH_IN_PERCENT_OF_PARENT = 60,
        HEIGHT_IN_PERCENT_OF_PARENT = 80;

    document.getElementById('graph').remove();

    let gd3 = d3.select('#selectors')
        .append('div')
        .style({
            width: WIDTH_IN_PERCENT_OF_PARENT + '%',
            'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

            height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
            'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
        })
        .attr('id','graph');

    let gd = gd3.node();

    let allData = savedData.concat(data);

    // https://stackoverflow.com/questions/33027334/categorical-axis-order-in-plotly-js
    let xValues = getStringAxisValues(statsData.season_year, 'x');

    let layout = {
        showlegend: true,
        legend: {
            x: 100,
            y: 1
        },
        xaxis: {
            title: 'Season',
            titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
            },
            categoryorder: "array",
            categoryarray: xValues
        },
        yaxis: {
            title: yaxis,
            titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f',
            }
        },
    };

    Plotly.newPlot(gd, allData, layout);

    // console.log(savedData.concat(data));

    window.onresize = function() {
        Plotly.Plots.resize(gd);
    };
}

/**
 * @property {string} season
 * @property {number} games
 * */
function createStatsData(selectedPlayerId, jsonResponse, positionCode, statText, statCategory ) {

    let season_stats = [];
    let season_year = [];
    let stat_description = [];
    let yaxis = "";

    let yFlag = false;

    hockeyApi.getPlayerStats(selectedPlayerId, jsonResponse);
    let response = jsonResponse.response.splits;

    if (positionCode.localeCompare("G") === 0) {
        response.forEach(function (season) {
            if ((season.league.hasOwnProperty('id')) && (season.league.id === hockeyApi.getNHLId())){
                let stat = season.stat[statCategory];
                season_stats.push(stat);
                let year = season.season;
                season_year.push(year.substring(0,4)+'-'+year.substring(4));
                if (typeof stat === 'string') {
                    yFlag = true;
                }
            }
        });
        yaxis = statText;
    }
    else {
        response.forEach(function (season) {
            if ((season.league.hasOwnProperty('id')) && (season.league.id === hockeyApi.getNHLId())){
                let stat = season.stat[statCategory];
                let games = season.stat.games;
                let timeRe = new RegExp(/^\d*:\d*$/);
                if ((typeof stat === 'string') && (timeRe.test(stat))){
                    let result = timeRe.exec(stat);
                    if (result[0].localeCompare(result.input) === 0) {
                        let time = stat.split(":");
                        let minutes = Number(time[0])/games;
                        let wholeMinutes = Math.floor(minutes);
                        let seconds = Math.round((((minutes - wholeMinutes)*games*60) + Number(time[1]))/games);
                        season_stats.push(wholeMinutes+(seconds/100));

                        yFlag = true;
                    }
                }
                else{
                    season_stats.push(stat/games);
                }
                let year = season.season;
                season_year.push(year.substring(0,4)+'-'+year.substring(4));
                stat_description.push(season.stat[statCategory] + " " + statText + " in " + season.stat.games + " games");
            }
        });
        yaxis = statText + " Per Game";
    }

    let xValues = getStringAxisValues(season_year, 'x');
    let yValues = getStringAxisValues(season_stats, 'y');

    return {
        season_stats: season_stats,
        season_year: season_year,
        stat_description: stat_description,
        yaxis: yaxis,
        xValues: xValues,
        yValues: yValues
    };
}

function addToCompare() {

    let compareList = document.getElementById('compares');
    let repeatFlag = false;

    let playerSelector = document.getElementById('playerSelector');
    let selectedPlayer = playerSelector.options[playerSelector.selectedIndex];

    compareList.childNodes.forEach(function (player) {
        if (player.id.localeCompare(selectedPlayer.value) === 0) {
            repeatFlag = true;
        }
    });

    if (repeatFlag === false){
        let playerPill = document.createElement('button');
        playerPill.className = "badge badge-pill badge-light mt-2";
        playerPill.textContent = "x " + selectedPlayer.text;
        playerPill.id = selectedPlayer.value;
        playerPill.onclick = function() { removeFromCompare(this);};

        // let playerPillLabel = document.createElement('label');
        // playerPillLabel.textContent = selectedPlayer.text;
        // playerPillLabel.setAttribute("for", selectedPlayer.text);
        // playerPillLabel.className = "mt-3";

        compareList.appendChild(playerPill);
        // compareList.appendChild(playerPillLabel);

        savedData.push(data[0]);
        savedYears = savedYears.concat(data[0].x);

    }
}

function removeFromCompare(e) {
    e.parentNode.removeChild(e);
    savedData = savedData.filter(findPlayer, e.id);
    createGraph();

}

function getStringAxisValues(values, axis) {

    let axisValues = [];

    savedData.forEach(function (data) {
        console.log(data[axis]);
        axisValues = axisValues.concat(data[axis]);
    });

    return sortNuniq(axisValues.concat(values));
}

// https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
function sortNuniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

function findPlayer(player) {
    return player.id.localeCompare(this);
}



