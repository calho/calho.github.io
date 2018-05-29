import requests, json, sys
import matplotlib.pyplot as plt
import numpy as np
import math
from collections import namedtuple


class HockeyAPI:

    def __init__(self):
        self._API = 'https://statsapi.web.nhl.com/api/v1/'
        self._NHL_ID = 133
        self._Teams = self.get_teams()

    def get_api_call_dict(self, parameter):
        resp = requests.get(self._API+parameter)
        resp.raise_for_status()
        parameter_resp = resp.json().get(parameter)
        member_dict = {}
        for member in parameter_resp:
            member_dict[member.get('id')] = member.get('name')
        return member_dict

    def get_teams(self):
        resp = requests.get(self._API+'teams')
        resp.raise_for_status()
        teams = resp.json().get('teams')
        team_dict = {}
        for team in teams:
            team_dict[team.get('id')] = self.json_to_obj(team)
        return team_dict

    def get_roster(self, team_id):
        resp = requests.get(self._API + 'teams/{}/roster'.format(team_id))
        resp.raise_for_status()
        roster = resp.json().get('roster')
        roster_dict = {}
        for player in roster:
            roster_dict[player.get('person').get('id')] = self.json_to_obj(player)
        return roster_dict

    def get_player_stats(self, player_id):
        resp = requests.get(self._API + 'people/{}/stats?stats=yearByYear'.format(player_id))
        resp.raise_for_status()
        stats = self.json_to_obj(resp.json().get('stats')[0])
        return stats

    @staticmethod
    def json_to_obj(data):
        temp = json.dumps(data)
        # https://stackoverflow.com/questions/6578986/how-to-convert-json-data-into-a-python-object
        return json.loads(temp, object_hook=lambda d: namedtuple('Object', d.keys())(*d.values()))

    def get_nhl_id(self):
        return self._NHL_ID

    def get_nhl_teams(self):
        return self._Teams

