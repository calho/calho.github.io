let hockeyApi=new HockeyAPI;function initiatePage(){fillTeamSelector(),fillPlayerSelector(!0),createGraph()}function fillTeamSelector(){hockeyApi.getTeams()}function fillPlayerSelector(e=!1){let t=document.getElementById("teamSelector");document.getElementById("playerSelector").options.length=0,hockeyApi.getRoster(t.options[t.selectedIndex].value,e)}function createGraph(){let e=document.getElementById("playerSelector"),t=new JsonResponse,o=[],l=[],n=e.options[e.selectedIndex];hockeyApi.getPlayerStats(n.value,t),t.response.splits.forEach(function(e){if(e.league.hasOwnProperty("id")&&e.league.id===hockeyApi.getNHLId()){l.push(e.stat.points);let t=e.season;o.push(t.substring(0,4)+"-"+t.substring(4))}});let i={x:o,y:l,name:n.text,type:"scatter"},s=Plotly.d3;document.getElementById("graph").remove();let a=s.select("#selectors").append("div").style({width:"60%","margin-left":"20%",height:"80vh","margin-top":"10vh"}).attr("id","graph").node(),r=[i];Plotly.newPlot(a,r,{showlegend:!0,legend:{x:100,y:1},xaxis:{title:"Season",titlefont:{family:"Courier New, monospace",size:18,color:"#7f7f7f"}},yaxis:{title:"Points",titlefont:{family:"Courier New, monospace",size:18,color:"#7f7f7f"}}}),window.onresize=function(){Plotly.Plots.resize(a)}}