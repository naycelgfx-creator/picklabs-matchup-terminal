import requests
import json

class ESPNCompleteAPI:
    def __init__(self):
        self.base = "https://site.api.espn.com/apis/site/v2/sports"
        self.common = "https://site.api.espn.com/apis/common/v3/sports"
        self.v2 = "https://site.api.espn.com/apis/v2/sports"
    
    # ==================== SCOREBOARDS ====================
    def get_nba_scoreboard(self):
        return requests.get(f"{self.base}/basketball/nba/scoreboard").json()
    
    def get_nfl_scoreboard(self):
        return requests.get(f"{self.base}/football/nfl/scoreboard").json()
    
    def get_mlb_scoreboard(self):
        return requests.get(f"{self.base}/baseball/mlb/scoreboard").json()
    
    def get_nhl_scoreboard(self):
        return requests.get(f"{self.base}/hockey/nhl/scoreboard").json()
    
    def get_ncaaf_scoreboard(self):
        return requests.get(f"{self.base}/football/college-football/scoreboard").json()
    
    def get_ncaab_scoreboard(self):
        return requests.get(f"{self.base}/basketball/mens-college-basketball/scoreboard").json()
    
    def get_premier_league_scoreboard(self):
        return requests.get(f"{self.base}/soccer/eng.1/scoreboard").json()
    
    def get_champions_league_scoreboard(self):
        return requests.get(f"{self.base}/soccer/uefa.champions/scoreboard").json()
    
    def get_mls_scoreboard(self):
        return requests.get(f"{self.base}/soccer/usa.1/scoreboard").json()
    
    def get_ufc_scoreboard(self):
        return requests.get(f"{self.base}/mma/ufc/scoreboard").json()
    
    def get_pga_scoreboard(self):
        return requests.get(f"{self.base}/golf/pga/scoreboard").json()
    
    def get_tennis_scoreboard(self):
        return requests.get(f"{self.base}/tennis/atp/scoreboard").json()
    
    # ==================== TEAMS ====================
    def get_nba_teams(self):
        return requests.get(f"{self.base}/basketball/nba/teams").json()
    
    def get_nfl_teams(self):
        return requests.get(f"{self.base}/football/nfl/teams").json()
    
    def get_mlb_teams(self):
        return requests.get(f"{self.base}/baseball/mlb/teams").json()
    
    def get_nhl_teams(self):
        return requests.get(f"{self.base}/hockey/nhl/teams").json()
    
    def get_team_roster(self, sport, league, team_id):
        """Get specific team roster
        Example: get_team_roster('basketball', 'nba', '13')
        """
        return requests.get(f"{self.base}/{sport}/{league}/teams/{team_id}/roster").json()
    
    # ==================== PLAYERS ====================
    def get_player_stats(self, sport, league, player_id):
        """Get player statistics
        Example: get_player_stats('basketball', 'nba', '1966')
        """
        return requests.get(f"{self.common}/{sport}/{league}/athletes/{player_id}/statistics").json()
    
    def get_all_players(self, sport, league):
        """Get all players in a league"""
        return requests.get(f"{self.base}/{sport}/{league}/athletes").json()
    
    # ==================== STANDINGS ====================
    def get_nba_standings(self):
        return requests.get(f"{self.v2}/basketball/nba/standings").json()
    
    def get_nfl_standings(self):
        return requests.get(f"{self.v2}/football/nfl/standings").json()
    
    def get_mlb_standings(self):
        return requests.get(f"{self.v2}/baseball/mlb/standings").json()
    
    # ==================== NEWS ====================
    def get_nba_news(self):
        return requests.get(f"{self.base}/basketball/nba/news").json()
    
    def get_nfl_news(self):
        return requests.get(f"{self.base}/football/nfl/news").json()
    
    def get_all_sports_news(self):
        return requests.get(f"{self.base}/news").json()
    
    # ==================== BETTING ODDS ====================
    def get_game_odds(self, sport, league):
        """Extract betting odds from scoreboard"""
        scoreboard = requests.get(f"{self.base}/{sport}/{league}/scoreboard").json()
        
        odds_list = []
        for event in scoreboard.get('events', []):
            game_odds = {
                'game': event.get('name'),
                'date': event.get('date'),
                'status': event['status']['type']['description'],
                'odds': event['competitions'][0].get('odds', []),
                'spread': None,
                'overUnder': None,
                'moneyline': {}
            }
            
            # Extract specific odds if available
            if game_odds['odds']:
                for odd in game_odds['odds']:
                    if 'details' in odd:
                        game_odds['spread'] = odd.get('details')
                    if 'overUnder' in odd:
                        game_odds['overUnder'] = odd.get('overUnder')
            
            odds_list.append(game_odds)
        
        return odds_list

if __name__ == "__main__":
    # ==================== USAGE EXAMPLES ====================
    espn = ESPNCompleteAPI()

    # Get live NBA games with odds
    nba_live = espn.get_nba_scoreboard()
    print("NBA LIVE GAMES:")
    print(json.dumps(nba_live, indent=2)[:500] + "...\n")

    # Get NFL teams
    nfl_teams = espn.get_nfl_teams()
    print("\nNFL TEAMS:")
    print(json.dumps(nfl_teams, indent=2)[:500] + "...\n")

    # Get Lakers roster (team ID 13)
    lakers_roster = espn.get_team_roster('basketball', 'nba', '13')
    print("\nLAKERS ROSTER:")
    print(json.dumps(lakers_roster, indent=2)[:500] + "...\n")

    # Get LeBron James stats (player ID 1966)
    lebron_stats = espn.get_player_stats('basketball', 'nba', '1966')
    print("\nLEBRON STATS:")
    print(json.dumps(lebron_stats, indent=2)[:500] + "...\n")

    # Get NBA betting odds
    nba_odds = espn.get_game_odds('basketball', 'nba')
    print("\nNBA BETTING ODDS:")
    print(json.dumps(nba_odds, indent=2)[:500] + "...\n")

    # Get NFL standings
    nfl_standings = espn.get_nfl_standings()
    print("\nNFL STANDINGS:")
    print(json.dumps(nfl_standings, indent=2)[:500] + "...\n")

    # Get sports news
    nba_news = espn.get_nba_news()
    print("\nNBA NEWS:")
    print(json.dumps(nba_news, indent=2)[:500] + "...\n")
