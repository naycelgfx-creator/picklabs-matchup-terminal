import requests
import json
from datetime import datetime

class YahooSportsAPI:
    def __init__(self):
        self.base_url = "https://us-api.yahoofs-sports.com/v2"
    
    def get_live_games(self):
        """Get ALL live games right now - every sport"""
        url = f"{self.base_url}/feed/realtime"
        response = requests.get(url)
        return response.json()
    
    def get_todays_games(self):
        """Get all games today with scores"""
        today = datetime.now().strftime('%Y-%m-%d')
        url = f"{self.base_url}/games?date={today}"
        response = requests.get(url)
        return response.json()
    
    def get_nba_teams_players(self):
        """Get full NBA teams + every player + stats"""
        url = f"{self.base_url}/leagues/nba.l.1234/teams?includeRoster=true&includeStats=true"
        response = requests.get(url)
        return response.json()
    
    def get_nfl_teams_players(self):
        """Get full NFL teams + every player + stats"""
        url = f"{self.base_url}/leagues/nfl.l.1234/teams?includeRoster=true&includeStats=true"
        response = requests.get(url)
        return response.json()
    
    def get_specific_game(self, game_id):
        """Get live data for one specific game"""
        url = f"{self.base_url}/games/{game_id}/live"
        response = requests.get(url)
        return response.json()

if __name__ == "__main__":
    # USAGE EXAMPLE FOR YOUR BETTING APP:
    api = YahooSportsAPI()

    # Get all live games
    live_games = api.get_live_games()
    print("LIVE GAMES NOW:")
    print(json.dumps(live_games, indent=2))

    # Get today's games
    todays_games = api.get_todays_games()
    print("\nTODAY'S GAMES:")
    print(json.dumps(todays_games, indent=2))

    # Get NBA teams and players
    nba_data = api.get_nba_teams_players()
    print("\nNBA TEAMS & PLAYERS:")
    print(json.dumps(nba_data, indent=2))
