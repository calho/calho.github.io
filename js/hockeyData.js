let hockeyApi = new HockeyAPI();

function initiatePage() {
    fillTeamSelector();
    fillPlayerSelector(true);
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

function createGraph() {

    let playerSelector = document.getElementById('playerSelector');
    let jsonResponse = new JsonResponse();

    let season_year = [];
    let season_points = [];

    let selectedPlayer = playerSelector.options[playerSelector.selectedIndex];

    hockeyApi.getPlayerStats(selectedPlayer.value, jsonResponse);
    let response = jsonResponse.response.splits;
    response.forEach(function (season) {
        if ((season.league.hasOwnProperty('id')) && (season.league.id === hockeyApi.getNHLId())){
            season_points.push(season.stat.points);
            let year = season.season;
            season_year.push(year.substring(0,4)+'-'+year.substring(4));
        }
    });

    let trace = {
        x: season_year,
        y: season_points,
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
            title: 'Points',
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



