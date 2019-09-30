function showLoader() {
  if (this.readyState !== 4) {
      document.getElementById("loader").style.display = "block";
  }
}

function hideLoader() {
  if (this.readyState !== 4) {
      document.getElementById("loader").style.display = "none";
  }
}

var teamNames = [""];
var teamAbr = [""];
var elementNames = [""];
var allPlayers = [{}];
const proxyurl = "https://cors-anywhere.herokuapp.com/";

function firstLoad() {

  showLoader();
  const url = "https://fantasy.premierleague.com/api/bootstrap-static/"; // site that doesn’t send Access-Control-*
  fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
      .then(
          function(response) {

              if (response.status !== 200) {
                  console.log('Looks like there was a problem. Status Code: ' +
                      response.status);
                  return;
              }

              // Examine the text in the response
              response.json().then(function(data) {

                  hideLoader();

                  console.log(data);


                  var playerArray = data.elements;
                  var teamArray = data.teams;
                  var elementArray = data.element_types;
                  var output = "";
                  var headerSearchResults = "";
                  

                  for (var team = 0; team < teamArray.length; team++) {
                      teamNames.push(teamArray[team].name);
                  }
                  for (var team = 0; team < teamArray.length; team++) {
                      teamAbr.push(teamArray[team].short_name);
                  }
                  for (var element = 0; element < elementArray.length; element++) {
                      elementNames.push(elementArray[element].singular_name);
                  }
                  for (var player = 0; player < playerArray.length; player++) {

                      //add to object allPlayers
                      allPlayers[player] = playerArray[player];

                      var playerID = playerArray[player].id;
                      var playerFirst = playerArray[player].first_name;
                      var playerLast = playerArray[player].second_name;
                      var playerWebName = playerArray[player].web_name;
                      var anchorTag = playerWebName.toLowerCase();
                      var playerName = playerFirst + " " + playerLast;
                      var playerSquad_Number = playerArray[player].squad_number;
                      var playerTeam = playerArray[player].team;
                      var playerAbbrev = teamAbr[playerTeam];
                      var playerTeamName = teamNames[playerTeam];
                      var playerElement = playerArray[player].element_type;
                      var playerSelectedByPercent = playerArray[player].selected_by_percent;
                      var playerForm = playerArray[player].form;
                      var playerGoals = playerArray[player].goals_scored;
                      var playerAssists = playerArray[player].assists;
                      var playerYellow = playerArray[player].yellow_cards;
                      var playerRed = playerArray[player].red_cards;

                  }




                  headerSearchResults += "<ul id='headerSearch'>";

                  for (var player = 0; player < playerArray.length; player++) {

                      headerSearchResults += "<li id='playername'><a name='" + playerArray[player].web_name.toLowerCase() + "' tabindex='0' onclick='indepthPlayer(" + playerArray[player].id + ",\"" + playerArray[player].first_name + " " + playerArray[player].second_name + "\")'>" + playerArray[player].first_name + " " + playerArray[player].second_name + "</a></li>";

                  }
                  headerSearchResults += "</ul>";
                  document.getElementById("headerSearchResults").innerHTML = headerSearchResults;

                  const stats = playerArray.reduce((stats, player) => {
                      ['minutes', 'goals_scored', 'assists', 'selected_by_percent', 'saves', 'red_cards', 'yellow_cards', 'form', 'transfers_out_event', 'transfers_in_event'].forEach(key => {
                          if (player[key] > stats[key].max) {
                              stats[key].max = player[key];
                              stats[key].bestPlayer = player;
                          }
                      });
                      return stats;
                  }, {
                      minutes: {
                          max: 0,
                          bestPlayer: null
                      },
                      goals_scored: {
                          max: 0,
                          bestPlayer: null
                      },
                      assists: {
                          max: 0,
                          bestPlayer: null
                      },
                      red_cards: {
                          max: 0,
                          bestPlayer: null
                      },
                      yellow_cards: {
                          max: 0,
                          bestPlayer: null
                      },
                      saves: {
                          max: 0,
                          bestPlayer: null
                      },
                      selected_by_percent: {
                          max: 0,
                          bestPlayer: null
                      },
                      form: {
                          max: 0,
                          bestPlayer: null
                      },
                      transfers_out_event: {
                          max: 0,
                          bestPlayer: null
                      },
                      transfers_in_event: {
                          max: 0,
                          bestPlayer: null
                      },

                  });

                  output += "<div class='wrapper'>";

                  output += "<div id='playerslist' class='box'><a class='search-all' href='search.html'><span>Search all players</span></a><i class='fas fa-search'></i></div>";

                  output += "<div class='box no-hover'><p class='title'>Goals<span class='stat'>" + stats.goals_scored.max + "</span></p><p class='player'>" + stats.goals_scored.bestPlayer.web_name + "</p><img id='home-thumb' src='https://premierleague-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + stats.goals_scored.bestPlayer.code + ".png'><span class='badge badge-100 " + teamAbr[stats.goals_scored.bestPlayer.team] + "'></span></div>";
                  output += "<div class='box no-hover'><p class='title'>Assists<span class='stat'>" + stats.assists.max + "</span></p><p class='player'>" + stats.assists.bestPlayer.web_name + "</p><img id='home-thumb' src='https://premierleague-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + stats.assists.bestPlayer.code + ".png'><span class='badge badge-100 " + teamAbr[stats.assists.bestPlayer.team] + "'></span></div>";
                  output += "<div class='box no-hover'><p class='title'>Form<span class='stat'>" + stats.form.max + "</span></p><p class='player'>" + stats.form.bestPlayer.web_name + "</p><img id='home-thumb' src='https://premierleague-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + stats.form.bestPlayer.code + ".png'><span class='badge badge-100 " + teamAbr[stats.form.bestPlayer.team] + "'></span></div>";
                  output += "<div class='box no-hover'><p class='title'>Transfered Out<span class='stat'>" + stats.transfers_out_event.max.toLocaleString() + "</span></p><p class='player'>" + stats.transfers_out_event.bestPlayer.web_name + "</p><img id='home-thumb'  src='https://premierleague-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + stats.transfers_out_event.bestPlayer.code + ".png'><span class='badge badge-100 " + teamAbr[stats.transfers_out_event.bestPlayer.team] + "'></span></div>";
                  output += "<div class='box no-hover'><p class='title'>Transfered In<span class='stat'>" + stats.transfers_in_event.max.toLocaleString() + "</span></p><p class='player'>" + stats.transfers_in_event.bestPlayer.web_name + "</p><img id='home-thumb' src='https://premierleague-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + stats.transfers_in_event.bestPlayer.code + ".png'><span class='badge badge-100 " + teamAbr[stats.transfers_in_event.bestPlayer.team] + "'></span></div>";
                  // output += "<div class='box no-hover'><p class='title'>Red Cards<span class='stat'>" + stats.red_cards.max + "</span></p><p class='player'>" + stats.red_cards.bestPlayer.web_name + "</p><img id='home-thumb' src='https://premierleague-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + stats.red_cards.bestPlayer.code + ".png'><span class='badge badge-100 " + teamAbr[stats.red_cards.bestPlayer.team] + "'></span></div>";
                  output += "<div class='box no-hover'><p class='title'>Saves<span class='stat'>" + stats.saves.max + "</span></p><p class='player'>" + stats.saves.bestPlayer.web_name + "</p><img id='home-thumb'  src='https://premierleague-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + stats.saves.bestPlayer.code + ".png'><span class='badge badge-100 " + teamAbr[stats.saves.bestPlayer.team] + "'></span></div>";

                  output += "<div id='teamslist' class='box'><a class='team-all' href='teams.html'><span>Search all teams</span><img class='pl-logo' src='./assets/pl-logo.png'></a></div>";


                  output += "</div>"



                  document.getElementById("output").innerHTML = output;



                  //console.log(allPlayers);

              });
          }
      )
      .catch(function(err) {});

}


function dataLoadOnly() {

  showLoader();
  const url = "https://fantasy.premierleague.com/api/bootstrap-static/"; // site that doesn’t send Access-Control-*
  fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
      .then(
          function(response) {

              if (response.status !== 200) {
                  console.log('Looks like there was a problem. Status Code: ' +
                      response.status);
                  return;
              }

              // Examine the text in the response
              response.json().then(function(data) {

                  hideLoader();


                  var playerArray = data.elements;
                  var teamArray = data.teams;
                  var elementArray = data.element_types;
                  var headerSearchResults = "";

                  for (var team = 0; team < teamArray.length; team++) {
                      teamNames.push(teamArray[team].name);
                  }
                  for (var team = 0; team < teamArray.length; team++) {
                      teamAbr.push(teamArray[team].short_name);
                  }
                  for (var element = 0; element < elementArray.length; element++) {
                      elementNames.push(elementArray[element].singular_name);
                  }
                  for (var player = 0; player < playerArray.length; player++) {

                      //add to object allPlayers
                      allPlayers[player] = playerArray[player];

                      var playerID = playerArray[player].id;
                      var playerFirst = playerArray[player].first_name;
                      var playerLast = playerArray[player].second_name;
                      var playerWebName = playerArray[player].web_name;
                      var anchorTag = playerWebName.toLowerCase();
                      var playerName = playerFirst + " " + playerLast;
                      var playerSquad_Number = playerArray[player].squad_number;
                      var playerTeam = playerArray[player].team;
                      var playerAbbrev = teamAbr[playerTeam];
                      var playerTeamName = teamNames[playerTeam];
                      var playerElement = playerArray[player].element_type;
                      var playerSelectedByPercent = playerArray[player].selected_by_percent;
                      var playerForm = playerArray[player].form;
                      var playerGoals = playerArray[player].goals_scored;
                      var playerAssists = playerArray[player].assists;
                      var playerYellow = playerArray[player].yellow_cards;
                      var playerRed = playerArray[player].red_cards;

                  }

                  headerSearchResults += "<ul id='headerSearch'>";

                  for (var player = 0; player < playerArray.length; player++) {

                      headerSearchResults += "<li id='playername'><a name='" + playerArray[player].web_name.toLowerCase() + "' tabindex='0' onclick='indepthPlayer(" + playerArray[player].id + ",\"" + playerArray[player].first_name + " " + playerArray[player].second_name + "\")'>" + playerArray[player].first_name + " " + playerArray[player].second_name + "</a></li>";

                  }
                  headerSearchResults += "</ul>";
                  document.getElementById("headerSearchResults").innerHTML = headerSearchResults;


              });
          }
      )
      .catch(function(err) {});

}




function loadPlayers() {


    
  document.getElementById("output").innerHTML = '';
  showLoader();

  const url = "https://fantasy.premierleague.com/api/bootstrap-static/"; // site that doesn’t send Access-Control-*
  fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
      .then(
          function(response) {

              if (response.status !== 200) {
                  console.log('Looks like there was a problem. Status Code: ' +
                      response.status);
                  return;
              }

              // Examine the text in the response
              response.json().then(function(data) {

                  hideLoader();

                  var playerArray = data.elements;
                  var teamArray = data.teams;
                  var elementArray = data.element_types;
                  var output = "";
                  var headerSearchResults = "";

                  output += '<div class="search-area"><input type="text" id="playerSearchInput" onkeyup="playerSearch()" autofocus="autofocus" onfocus="this.select()" placeholder="Search for names.."></div>';

                  output += "<table id='playerList'><thead><tr><th role='columnheader'>Name</th><th role='columnheader'>Team</th><th role='columnheader'>Position</th><th role='columnheader' >Selected <span>by</span></th><th role='columnheader'>Form</th><th role='columnheader'>Goals</th><th role='columnheader'>Assists</th><th role='columnheader'>Yellow</th><th role='columnheader'>Red</th></tr></thead><tbody>";

                  for (var team = 0; team < teamArray.length; team++) {
                      teamNames.push(teamArray[team].name);
                  }
                  for (var team = 0; team < teamArray.length; team++) {
                      teamAbr.push(teamArray[team].short_name);
                  }
                  for (var element = 0; element < elementArray.length; element++) {
                      elementNames.push(elementArray[element].singular_name);
                  }
                  for (var player = 0; player < playerArray.length; player++) {

                      //add to object allPlayers
                      allPlayers[player] = playerArray[player];

                      var playerID = playerArray[player].id;
                      var playerFirst = playerArray[player].first_name;
                      var playerLast = playerArray[player].second_name;
                      var playerWebName = playerArray[player].web_name;
                      var anchorTag = playerWebName.toLowerCase();
                      var playerName = playerFirst + " " + playerLast;
                      var playerSquad_Number = playerArray[player].squad_number;
                      var playerTeam = playerArray[player].team;
                      var playerAbbrev = teamAbr[playerTeam];
                      var playerTeamName = teamNames[playerTeam];
                      var playerElement = playerArray[player].element_type;
                      var playerSelectedByPercent = playerArray[player].selected_by_percent;
                      var playerForm = playerArray[player].form;
                      var playerGoals = playerArray[player].goals_scored;
                      var playerAssists = playerArray[player].assists;
                      var playerYellow = playerArray[player].yellow_cards;
                      var playerRed = playerArray[player].red_cards;

                  }

                  headerSearchResults += "<ul id='headerSearch'>";

                  for (var player = 0; player < playerArray.length; player++) {

                      headerSearchResults += "<li id='playername'><a name='" + playerArray[player].web_name.toLowerCase() + "' tabindex='0' onclick='indepthPlayer(" + playerArray[player].id + ",\"" + playerArray[player].first_name + " " + playerArray[player].second_name + "\")'>" + playerArray[player].first_name + " " + playerArray[player].second_name + "</a></li>";

                  }
                  headerSearchResults += "</ul>";
                  document.getElementById("headerSearchResults").innerHTML = headerSearchResults;


                  // console.log(teamNames);
                  // console.log(teamAbr);
                  // console.log(elementNames);
                  // console.log(allPlayers);

                  for (var player = 0; player < playerArray.length; player++) {

                      var playerID = playerArray[player].id;
                      var playerFirst = playerArray[player].first_name;
                      var playerLast = playerArray[player].second_name;
                      var playerWebName = playerArray[player].web_name;
                      var anchorTag = playerWebName.toLowerCase();
                      var playerName = playerFirst + " " + playerLast;
                      var playerSquad_Number = playerArray[player].squad_number;
                      var playerTeam = playerArray[player].team;
                      var playerAbbrev = teamAbr[playerTeam];
                      var playerTeamName = teamNames[playerTeam];
                      var playerElement = playerArray[player].element_type;
                      var playerSelectedByPercent = playerArray[player].selected_by_percent;
                      var playerForm = playerArray[player].form;
                      var playerGoals = playerArray[player].goals_scored;
                      var playerAssists = playerArray[player].assists;
                      var playerYellow = playerArray[player].yellow_cards;
                      var playerRed = playerArray[player].red_cards;

                      output += "<tr id='player-" + playerID + "' class='team-" + playerAbbrev + " player player-" + playerID + "' >";

                      output += "<td id='playername' tabindex='0' onclick='indepthPlayer(" + playerID + ",\"" + playerName + "\")'><a name='" + anchorTag + "' >" + playerName + "</a></td>";
                      output += "<td onclick='teamSearch(" + playerID + ",\"" + playerName + "\"," + playerTeam + ")'>" + "<span class='badge badgesize-25 " + playerAbbrev + "'></span></td>";
                      output += "<td class='tableposition' onclick='indepthPlayer(" + playerID + ",\"" + playerName + "\")'>" + elementNames[playerElement] + "</td>";
                      output += "<td class='selectedby' onclick='indepthPlayer(" + playerID + ",\"" + playerName + "\")'>" + playerSelectedByPercent + "%</td>";
                      output += "<td class='form' onclick='indepthPlayer(" + playerID + ",\"" + playerName + "\")'>" + playerForm + "</td>";
                      output += "<td class='goals' onclick='indepthPlayer(" + playerID + ",\"" + playerName + "\")'>" + playerGoals + "</td>";
                      output += "<td class='assists' onclick='indepthPlayer(" + playerID + ",\"" + playerName + "\")'>" + playerAssists + "</td>";
                      output += "<td class='yellows' onclick='indepthPlayer(" + playerID + ",\"" + playerName + "\")'>" + playerYellow + "</td>";
                      output += "<td class='reds' onclick='indepthPlayer(" + playerID + ",\"" + playerName + "\")'>" + playerRed + "</td>";

                      output += "</tr>";

                  }

                  output += "</tbody></table>";

                  document.getElementById("output").innerHTML = output;

                  new Tablesort(document.getElementById('playerList'), {
                      descending: true
                  });

              });
          }
      )
      .catch(function(err) {});

}

function playerSearch() {

  // Declare variables 
  var input, filter, table, tr, td, i;
  input = document.getElementById("playerSearchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("playerList");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
          if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
          } else {
              tr[i].style.display = "none";
          }
      }
  }
}

function headerSearchFunction() {
  // Declare variables
  var input, filter, ul, li, a, i;
  input = document.getElementById("headerPlayerSearchInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("headerSearch");
  li = ul.getElementsByTagName("li");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
      } else {
          li[i].style.display = "none";
      }
  }

  var input = document.getElementById('headerPlayerSearchInput');
  var resultsarea = document.getElementById('headerSearchResults');

  input.addEventListener("input", function(e) {

      if (this.value.length > 1) {
          resultsarea.style.height = 'auto';
      } else {
          resultsarea.style.height = '0px';
      }
      input.addEventListener('focus', function() {
          // resultsarea.style.height= 'auto';
          if (input.value.length > 1) {
              resultsarea.style.height = 'auto';
          }

      });
      input.addEventListener('focusout', function() {
          // alert('off');

          // if (input.value.length > 1) { 
          //   resultsarea.style.height= '0px';
          // } else {
          //   resultsarea.style.height= '0px';  
          // }

          // resultsarea.style.height= '0px';

      });



  });


};




function indepthPlayer(playerID, playerName) {

  dataLoadOnly();

  var outputdiv = document.getElementById("output");
  outputdiv.classList.add("indepthActive");

  showLoader();

  const url = "https://fantasy.premierleague.com/api/element-summary/" + playerID + "/"; // site that doesn’t send Access-Control-*
  fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
      .then(
          function(response) {
              if (response.status !== 200) {
                  console.log('Looks like there was a problem. Status Code: ' +
                      response.status);
                  return;
              }

              // Examine the text in the response
              response.json().then(function(data) {

                console.log(data)
                  window.scrollTo(0, 0);
                  hideLoader();

                  var input = document.getElementById('headerPlayerSearchInput');
                  var resultsarea = document.getElementById('headerSearchResults');
                  input.value = '';
                  resultsarea.style.height = '0px';



                  var selectedPlayer = allPlayers.filter(obj => {
                      return obj.id === playerID
                  })
                  // console.log(selectedPlayer);
                  var fixturesSummary = data.fixtures;
                //   var upcomingFixtures = data.fixtures;
                  var historyFixtures = data.history;
                  var nextisHome = data.fixtures[0].is_home;
                  if (nextisHome == true) {
                      var nextha = ' (H)';
                  } else {
                      var nextha = ' (A)'
                  };
                  var output = "";
                  var playerBanner = "";

                  var squad_number = selectedPlayer[0].squad_number;
                  var elementID = selectedPlayer[0].element_type;


                  playerBanner += "<div id='banner-bg'>";

                  playerBanner += "<div class='player-image'>";

                  playerBanner += "<span class='badge badge-100 " + teamAbr[selectedPlayer[0].team] + "'></span>";
                  playerBanner += "<img id='playerimg' src='https://premierleague-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + selectedPlayer[0].code + ".png'>";

                  playerBanner += "</div>";

                  playerBanner += "<div class='player-intro'>";

                  playerBanner += "<div class='third player-name-area'>";


                  playerBanner += "<h1 class='player-name'>" + playerName + "</h1>";
                  playerBanner += "<h2 class='team-name'>" + teamNames[selectedPlayer[0].team] + "</h2>";
                  playerBanner += "<h3 class='position'>" + elementNames[selectedPlayer[0].element_type] + "</h3>";

                  playerBanner += "</div>";

                  playerBanner += "<div class='third playerindepthinfo'>";

                  playerBanner += "<table>";

                  playerBanner += "<tr><td>Owned by</td><td>" + selectedPlayer[0].selected_by_percent + "%</td></tr>";
                  playerBanner += "<tr><td>Current Form</td><td>" + selectedPlayer[0].form + "</td></tr>";
                  playerBanner += "<tr><td>Next Fixture</td><td>" + fixturesSummary[0].opponent_name + nextha + "</td></tr>";

                  playerBanner += "</table>";
                  playerBanner += "</div>";

                  playerBanner += "</div>";

                  playerBanner += "</div>";



                  output += "<table id='previousFixtures'><thead><tr>";
                  output += "<th>Gameweek</th>";
                  output += "<th>Fixture</th>";
                  output += "<th>Points</th>";
                  output += "<th>Goals</th>";
                  output += "<th>Assists</th>";
                  output += "<th>Minutes Played</th>";
                  output += "<th>Price</th>";
                  output += "<th>Net Transfers</th>";
                  output += "<th>Selected by</th>";
                  output += "<th>Yellows</th>";
                  output += "<th>Reds</th>";
                  output += "<th>Clean Sheets</th>";
                  output += "<th>Saves</th>";
                  output += "<th>BP</th>";

                  output += "</tr><thead><tbody>";

                  for (var game = 0; game < historyFixtures.length; game++) {

                      // if game isn't played yet - don't show the row
                      var homeScore = historyFixtures[game].team_h_score;
                      var awayScore = historyFixtures[game].team_a_score;
                      if (homeScore == null || awayScore == null) {
                          var homeScore = "TBC";
                          var awayScore = "TBC";
                      } else {

                          var wasHome = historyFixtures[game].was_home;
                          var opponentTeam = historyFixtures[game].opponent_team;

                          output += "<tr>"

                          output += "<td>" + historyFixtures[game].round + "</td>";

                          if (wasHome == true) {
                              output += "<td><b>" + teamAbr[selectedPlayer[0].team] + "</b> " + homeScore + " - " + awayScore + " " + teamNames[opponentTeam] + "</td>";
                          } else {
                              output += "<td>" + teamNames[opponentTeam] + " " + homeScore + " - " + awayScore + " <b>" + teamAbr[selectedPlayer[0].team] + "</b></td>";
                          }

                          output += "<td>" + historyFixtures[game].total_points + "</td>";
                          output += "<td>" + historyFixtures[game].goals_scored + "</td>";
                          output += "<td>" + historyFixtures[game].assists + "</td>";
                          output += "<td>" + historyFixtures[game].minutes + "</td>";



                          var value = historyFixtures[game].value;
                          var decimalValue = value / 10;

                          output += "<td>£" + decimalValue + "m</td>";
                          var netTransfers = historyFixtures[game].transfers_in - historyFixtures[game].transfers_out;
                          if (netTransfers > 0) {
                              output += "<td class='netTransfers positive'>" + netTransfers.toLocaleString() + "</td>";
                          } else if (netTransfers == 0) {
                              output += "<td class=''>" + netTransfers + "</td>";
                          } else {
                              output += "<td class='netTransfers negative'>" + netTransfers.toLocaleString() + "</td>";
                          }
                          output += "<td>" + historyFixtures[game].selected.toLocaleString() + "</td>";
                          output += "<td>" + historyFixtures[game].yellow_cards + "</td>";
                          output += "<td>" + historyFixtures[game].red_cards + "</td>";
                          output += "<td>" + historyFixtures[game].clean_sheets + "</td>";
                          output += "<td>" + historyFixtures[game].saves + "</td>";
                          output += "<td>" + historyFixtures[game].bonus + "</td>";
                          output += "</tr>";

                      }


                  }

                //   for (var game = 0; game < fixturesSummary.length; game++) {

                //       if (fixturesSummary[game].is_home == true) {
                //           var location = " (H) ";
                //       } else {
                //           var location = " (A) ";
                //       };
                //       output += "<tr>"

                //       let opponentName = fixturesSummary[game].opponent_name;

                //       output += "<td>" + fixturesSummary[game].event + "</td>";
                //       output += "<td>" + fixturesSummary[game].opponent_name + location + "(" + fixturesSummary[game].kickoff_time_formatted + ")</td>";

                //         output += "<td>" + teamNames[opponentTeam] + + location + "(" + fixturesSummary[game].kickoff_time_formatted + ")</td>"; 

                //       output += "<td></td>";
                //       output += "<td></td>";
                //       output += "<td></td>";
                //       output += "<td></td>";
                //       output += "<td></td>";
                //       output += "<td></td>";
                //       output += "<td></td>";
                //       output += "<td></td>";
                //       output += "<td></td>";
                //       output += "<td></td>";
                //       output += "<td></td>";
                //       output += "<td></td>";


                //       output += "</tr>";

                //   }

                  output += "</tbody></table>";


                  document.getElementById("output").innerHTML = output;
                  document.getElementById("playerBanner").innerHTML = playerBanner;


                  // console.log(data);
              });
          }
      )
      .catch(function(err) {});


};


function teamSearch(playerID, playerName, playerTeam) {

  showLoader();


  const url = "https://fantasy.premierleague.com/api/bootstrap-static/"; // site that doesn’t send Access-Control-*
  fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
      .then(
          function(response) {
              if (response.status !== 200) {
                  console.log('Looks like there was a problem. Status Code: ' +
                      response.status);
                  return;
              }

              // Examine the text in the response
              response.json().then(function(data) {

                  window.scrollTo(0, 0);
                  hideLoader();

                  var teamClicked = playerTeam;
                  var playerArray = data.elements;

                  var teamArray = data.teams;
                  var elementArray = data.element_types;
                  var output = "";

                  var teamNames = [""];
                  for (var team = 0; team < teamArray.length; team++) {
                      teamNames.push(teamArray[team].name);
                  }
                  var teamAbr = [""];
                  for (var team = 0; team < teamArray.length; team++) {
                      teamAbr.push(teamArray[team].short_name);
                  }
                  var elementNames = [""];
                  for (var element = 0; element < elementArray.length; element++) {
                      elementNames.push(elementArray[element].singular_name);
                  }

                  output += "<div class='title-area'><h1 class='teamtitle'>" + teamNames[playerTeam] + "</h1><a href='./search.html'>< Back to Players</a></div>";
                  output += "<div class='wrapper'>";

                  for (var player = 0; player < playerArray.length; player++) {

                      var playerID = playerArray[player].id;
                      var playerFirst = playerArray[player].first_name;
                      var playerLast = playerArray[player].second_name;
                      var playerWebName = playerArray[player].web_name;
                      var playerCode = playerArray[player].code;
                      var playerName = playerFirst + " " + playerLast;
                      var playerSquad_Number = playerArray[player].squad_number;
                      var playerAbbrev = teamAbr[playerTeam];
                      var playerElement = playerArray[player].element_type;
                      var playerSelectedByPercent = playerArray[player].selected_by_percent;
                      var playerForm = playerArray[player].form;
                      var playerGoals = playerArray[player].goals_scored;
                      var playerAssists = playerArray[player].assists;
                      var playerYellow = playerArray[player].yellow_cards;
                      var playerRed = playerArray[player].red_cards;
                      var position = elementNames[playerElement];

                      if (playerArray[player].team == teamClicked) {

                          //output += playerID;

                          output += "<div class='box pos-" + position.toLowerCase() + "' onclick='indepthPlayer(" + playerID + ",\"" + playerName + "\")'><p class='title'>" + elementNames[playerElement] + "<span class='stat'>" + "</span></p><p class='player'>" + playerWebName + "</p><img id='home-thumb' src='https://premierleague-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + playerCode + ".png'><span class='badge badge-100 " + playerAbbrev + "'></span></div>";

                      }

                  }

                  output += "</div>";

                  document.getElementById("output").innerHTML = output;




              });
          }
      )
      .catch(function(err) {});


};


function teamplayerSearch(playerTeam) {

  showLoader();

  const url = "https://fantasy.premierleague.com/api/bootstrap-static/"; // site that doesn’t send Access-Control-*
  fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
      .then(
          function(response) {
              if (response.status !== 200) {
                  console.log('Looks like there was a problem. Status Code: ' +
                      response.status);
                  return;
              }

              // Examine the text in the response
              response.json().then(function(data) {

                  window.scrollTo(0, 0);
                  hideLoader();

                  var playerArray = data.elements;
                  var teamArray = data.teams;
                  var elementArray = data.element_types;




                  var teamClicked = playerTeam;
                  var playerArray = data.elements;

                  var teamArray = data.teams;
                  var elementArray = data.element_types;
                  var output = "";

                  var teamNames = [""];
                  for (var team = 0; team < teamArray.length; team++) {
                      teamNames.push(teamArray[team].name);
                  }
                  var teamAbr = [""];
                  for (var team = 0; team < teamArray.length; team++) {
                      teamAbr.push(teamArray[team].short_name);
                  }
                  var elementNames = [""];
                  for (var element = 0; element < elementArray.length; element++) {
                      elementNames.push(elementArray[element].singular_name);
                  }

                  output += "<div class='title-area'><h1 class='teamtitle'>" + teamNames[playerTeam] + "</h1><a href='./teams.html'>< Back to Teams</a></div>";
                  output += "<div class='wrapper'>";

                  for (var player = 0; player < playerArray.length; player++) {

                      var playerID = playerArray[player].id;
                      var playerFirst = playerArray[player].first_name;
                      var playerLast = playerArray[player].second_name;
                      var playerWebName = playerArray[player].web_name;
                      var playerCode = playerArray[player].code;
                      var playerName = playerFirst + " " + playerLast;
                      var playerSquad_Number = playerArray[player].squad_number;
                      var playerAbbrev = teamAbr[playerTeam];
                      var playerElement = playerArray[player].element_type;
                      var playerSelectedByPercent = playerArray[player].selected_by_percent;
                      var playerForm = playerArray[player].form;
                      var playerGoals = playerArray[player].goals_scored;
                      var playerAssists = playerArray[player].assists;
                      var playerYellow = playerArray[player].yellow_cards;
                      var playerRed = playerArray[player].red_cards;
                      var position = elementNames[playerElement];

                      if (playerArray[player].team == teamClicked) {

                          //output += playerID;

                          output += "<div class='box pos-" + position.toLowerCase() + "' onclick='indepthPlayer(" + playerID + ",\"" + playerName + "\")'><p class='title'>" + elementNames[playerElement] + "<span class='stat'>" + "</span></p><p class='player'>" + playerWebName + "</p><img id='home-thumb' src='https://premierleague-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + playerCode + ".png'><span class='badge badge-100 " + playerAbbrev + "'></span></div>";

                      }

                  }

                  output += "</div>";

                  document.getElementById("output").innerHTML = output;



              });
          }
      )
      .catch(function(err) {});


}

function allTeams() {

    dataLoadOnly();

  document.getElementById("output").innerHTML = '';


  const url = "https://fantasy.premierleague.com/api/bootstrap-static/"; // site that doesn’t send Access-Control-*
  fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
      .then(
          function(response) {
              if (response.status !== 200) {
                  console.log('Looks like there was a problem. Status Code: ' +
                      response.status);
                  return;
              }

              // Examine the text in the response
              response.json().then(function(data) {

                  document.getElementById("output").innerHTML = '';

                  window.scrollTo(0, 0);
                  hideLoader();

                  var teamArray = data.teams;

                  var output = "";



                  output += "<div class='wrapper'>";

                  for (var team = 0; team < teamArray.length; team++) {

                      output += "<div class='box team-only' onclick='teamplayerSearch(" + teamArray[team].id + ")'><p class='player'>" + teamArray[team].name + "</p><span class='badge badge-100 " + teamArray[team].short_name + "'></span></div>";

                  }

                  output += "</div>";

                  document.getElementById("output").innerHTML = output;

              });
          }
      )
      .catch(function(err) {});




};