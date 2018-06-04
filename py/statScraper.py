from .hockeyAPI import HockeyAPI

def iinput(prompt):
    return input(prompt).strip().upper()


def get_team_id(teams_dict_param):
    t_input = None
    while t_input != 'EXIT':
        t_input = iinput('What team is the player from (type \'all\' to show all options): ')
        if t_input == 'ALL':
            for v in teams_dict_param.values():
                print(v.abbreviation)
        if any(v.abbreviation.strip().upper() == t_input for v in teams_dict_param.values()):
            team_data = next((t for t in teams_dict_param.values() if t.abbreviation.strip().upper() == t_input), None)
            return t_input, team_data.id
    return t_input, -1


def get_player_id(roster_dict_param):
    t_input = None
    while t_input != 'EXIT':
        t_input = iinput('Select player name (type \'all\' to show all current players on roster): ')
        if t_input == 'ALL':
            for v in roster_dict_param.values():
                print(v.person.fullName)
        if any(v.person.fullName.strip().upper() == t_input for v in roster_dict_param.values()):
            player_data = next((t for t in roster_dict_param.values() if t.person.fullName.strip().upper() == t_input), None)
            return t_input, player_data.person.id
    return t_input, -1


def get_all_teams():
    return HockeyAPI.get_nhl_teams()


myHockeyApi = HockeyAPI()
teams_dict = myHockeyApi.get_teams()
user_player = -1
user_input = None

user_input, user_team = get_team_id(teams_dict)

if user_input == 'EXIT':
    sys.exit()
else:
    rosters_dict = myHockeyApi.get_roster(user_team)

user_input, user_player = get_player_id(rosters_dict)

player_stats = myHockeyApi.get_player_stats(user_player)

total_points = 0
total_games = 0
season_points = []
season_year = []

for s in player_stats.splits:

    try:
        if hasattr(s.league, 'id') & (s.league.id == myHockeyApi.get_nhl_id()):
            total_points += s.stat.points
            season_points.append(s.stat.points/s.stat.games)
            total_games += s.stat.games
            season = s.season
            season_year.append(season[2:4]+'-'+season[6:])
    except AttributeError:
        pass

print('{} points in {} games'.format(total_points, total_games))
seasons = len(season_year)
x = []
for i in range(0, seasons):
    x.append(i)

degree = math.floor(seasons/2.0)
z = np.polyfit(x, season_points, degree)
f = np.poly1d(z)

x_new = np.linspace(x[0], x[-1], 50)
y_new = f(x_new)

plt.plot(season_year, season_points, '-bo', x_new, y_new, '-r')
plt.xlim([x[0]-1, x[-1] + 1])
plt.show()