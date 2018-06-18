let hockeyApi = new HockeyAPI();

function initiatePage() {
    fillTeamSelector();
    fillPlayerSelector(true);
    fillStatSelector();
    createGraph();
}

function fillTeamSelector() {
    hockeyApi.getTeams();

}

function fillPlayerSelector(set_default = false ) {
    let teamSelector = document.getElementById('teamSelector');
    document.getElementById('playerSelector').options.length = 0;
    hockeyApi.getRoster(teamSelector.options[teamSelector.selectedIndex].value, set_default);
}

function fillStatSelector() {
    let playerSelector = document.getElementById('playerSelector');

    let selectedPlayer = playerSelector.options[playerSelector.selectedIndex];

    let jsonResponse = new JsonResponse();

    hockeyApi.getPlayerStats(selectedPlayer.value, jsonResponse);
    let response = jsonResponse.response.splits;

    let season = findNHLLeague(response);

    let statSelector = document.getElementById('statSelector');
    statSelector.options.length = 0;

    for (let category in season.stat) {
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

function checkNHLLeague(season) {
    return ((season.league.hasOwnProperty('id')) && (season.league.id === hockeyApi.getNHLId()));
}

function findNHLLeague(stat) {
    return stat.find(checkNHLLeague);
}

function createGraph() {

    let playerSelector = document.getElementById('playerSelector');
    let jsonResponse = new JsonResponse();

    let season_year = [];
    let season_stats = [];
    let season_points = [];
    let yaxis = "";

    let selectedPlayer = playerSelector.options[playerSelector.selectedIndex];

    hockeyApi.getPlayerStats(selectedPlayer.value, jsonResponse);
    let response = jsonResponse.response.splits;
    
    hockeyApi.getPlayerInformation(selectedPlayer.value, jsonResponse);
    let playerInfoResponse = jsonResponse.response;

    let statSelector =  document.getElementById('statSelector');
    let statCategory = statSelector.options[statSelector.selectedIndex].value;
    let statText = statSelector.options[statSelector.selectedIndex].text;
    
    if (playerInfoResponse.primaryPosition.code.localeCompare("G") === 0) {
        response.forEach(function (season) {
            if ((season.league.hasOwnProperty('id')) && (season.league.id === hockeyApi.getNHLId())){
                season_stats.push(season.stat.savePercentage);
                let year = season.season;
                season_year.push(year.substring(0,4)+'-'+year.substring(4));
            }
        });
        yaxis = statText;
    }
    else {
        response.forEach(function (season) {
            if ((season.league.hasOwnProperty('id')) && (season.league.id === hockeyApi.getNHLId()) && season.stat.games > 0){
                season_stats.push(season.stat[statCategory]/season.stat.games);
                let year = season.season;
                season_year.push(year.substring(0,4)+'-'+year.substring(4));
                season_points.push(season.stat[statCategory] + " " + statText + " in " + season.stat.games + " games");
            }
        });
        yaxis = statText + " Per Game";
    }


    let trace = {
        x: season_year,
        y: season_stats,
        text: season_points,
        name: selectedPlayer.text,
        type: 'scatter'
    };

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
            }
        },
        yaxis: {
            title: yaxis,
            titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
            }
        },
    };


    let data = [trace];

    Plotly.newPlot(gd, data, layout);

    window.onresize = function() {
        Plotly.Plots.resize(gd);
    };
}



