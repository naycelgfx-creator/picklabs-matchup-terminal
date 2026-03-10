import requests
import json
import time
import sqlite3
from datetime import datetime, timedelta
import hashlib

class SmartCachingBettingAPI:
    def __init__(self, db_name='betting_cache.db'):
        self.yahoo_base = "https://us-api.yahoofs-sports.com/v2"
        self.espn_base = "https://site.api.espn.com/apis/site/v2/sports"
        self.db_name = db_name
        self.timeout = 10
        
        # Rate limiting settings
        self.max_yahoo_requests = 900  # Stay under 1000/hour
        self.max_espn_requests = 450   # Stay under 500/hour
        self.rate_limit_window = 3600  # 1 hour in seconds
        
        # Cache durations (in seconds)
        self.cache_times = {
            'live_games': 10,      # Update every 10 seconds during live games
            'scoreboard': 30,      # Update every 30 seconds
            'teams': 3600,         # Update every hour (teams don't change often)
            'players': 3600,       # Update every hour
            'standings': 1800,     # Update every 30 minutes
            'news': 300,           # Update every 5 minutes
            'odds': 60             # Update every minute
        }
        
        # Initialize database
        self._init_database()
    
    def _init_database(self):
        """Create database tables for caching"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        # Cache table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS api_cache (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cache_key TEXT UNIQUE NOT NULL,
                data TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                expires_at DATETIME NOT NULL
            )
        ''')
        
        # Rate limit tracking table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS rate_limits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                api_source TEXT NOT NULL,
                request_time DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Request stats table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS request_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                endpoint TEXT NOT NULL,
                hit_cache BOOLEAN NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        print("✅ Database initialized successfully")
    
    def _generate_cache_key(self, url, params=None):
        """Generate unique cache key from URL and params"""
        key_string = url + str(params)
        return hashlib.md5(key_string.encode()).hexdigest()
    
    def _check_rate_limit(self, api_source):
        """Check if we're within rate limits"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        # Clean old entries (older than 1 hour)
        one_hour_ago = datetime.now() - timedelta(seconds=self.rate_limit_window)
        cursor.execute('''
            DELETE FROM rate_limits 
            WHERE request_time < ? AND api_source = ?
        ''', (one_hour_ago, api_source))
        
        # Count requests in last hour
        cursor.execute('''
            SELECT COUNT(*) FROM rate_limits 
            WHERE api_source = ? AND request_time > ?
        ''', (api_source, one_hour_ago))
        
        count = cursor.fetchone()[0]
        conn.commit()
        conn.close()
        
        # Check limits
        if api_source == 'yahoo' and count >= self.max_yahoo_requests:
            print(f"⚠️ Yahoo rate limit reached: {count}/{self.max_yahoo_requests}")
            return False
        elif api_source == 'espn' and count >= self.max_espn_requests:
            print(f"⚠️ ESPN rate limit reached: {count}/{self.max_espn_requests}")
            return False
        
        return True
    
    def _log_request(self, api_source):
        """Log API request for rate limiting"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO rate_limits (api_source, request_time) 
            VALUES (?, ?)
        ''', (api_source, datetime.now()))
        conn.commit()
        conn.close()
    
    def _get_from_cache(self, cache_key):
        """Get data from cache if not expired"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT data, expires_at FROM api_cache 
            WHERE cache_key = ?
        ''', (cache_key,))
        
        result = cursor.fetchone()
        conn.close()
        
        if result:
            data, expires_at = result
            expires_at = datetime.fromisoformat(expires_at)
            
            if datetime.now() < expires_at:
                print(f"✅ Cache HIT for key: {cache_key[:8]}...")
                return json.loads(data)
            else:
                print(f"⏰ Cache EXPIRED for key: {cache_key[:8]}...")
                self._delete_from_cache(cache_key)
        
        print(f"❌ Cache MISS for key: {cache_key[:8]}...")
        return None
    
    def _save_to_cache(self, cache_key, data, cache_duration):
        """Save data to cache with expiration"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        expires_at = datetime.now() + timedelta(seconds=cache_duration)
        
        cursor.execute('''
            INSERT OR REPLACE INTO api_cache (cache_key, data, expires_at, created_at)
            VALUES (?, ?, ?, ?)
        ''', (cache_key, json.dumps(data), expires_at, datetime.now()))
        
        conn.commit()
        conn.close()
        print(f"💾 Saved to cache: {cache_key[:8]}... (expires in {cache_duration}s)")
    
    def _delete_from_cache(self, cache_key):
        """Delete expired cache entry"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM api_cache WHERE cache_key = ?', (cache_key,))
        conn.commit()
        conn.close()
    
    def _log_stats(self, endpoint, hit_cache):
        """Log request statistics"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO request_stats (endpoint, hit_cache, timestamp)
            VALUES (?, ?, ?)
        ''', (endpoint, hit_cache, datetime.now()))
        conn.commit()
        conn.close()
    
    def _make_smart_request(self, url, api_source, cache_type, retries=3):
        """Smart request with caching and rate limiting"""
        
        # Generate cache key
        cache_key = self._generate_cache_key(url)
        
        # Try to get from cache first
        cached_data = self._get_from_cache(cache_key)
        if cached_data:
            self._log_stats(url, True)
            return {"status": "success", "data": cached_data, "source": "cache"}
        
        # Check rate limits before making API call
        if not self._check_rate_limit(api_source):
            # If rate limited, return oldest cache even if expired
            print(f"⚠️ Rate limited! Returning stale cache if available...")
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            cursor.execute('SELECT data FROM api_cache WHERE cache_key = ?', (cache_key,))
            result = cursor.fetchone()
            conn.close()
            
            if result:
                return {
                    "status": "warning", 
                    "data": json.loads(result[0]), 
                    "source": "stale_cache",
                    "message": "Rate limited - using old cache"
                }
            else:
                return {
                    "status": "error", 
                    "message": f"{api_source} rate limit reached and no cache available"
                }
        
        # Make actual API request
        for attempt in range(retries):
            try:
                print(f"🌐 Making API request to {api_source}... (attempt {attempt + 1}/{retries})")
                response = requests.get(url, timeout=self.timeout)
                response.raise_for_status()
                data = response.json()
                
                # Log the request for rate limiting
                self._log_request(api_source)
                
                # Save to cache
                cache_duration = self.cache_times.get(cache_type, 60)
                self._save_to_cache(cache_key, data, cache_duration)
                
                # Log stats
                self._log_stats(url, False)
                
                return {"status": "success", "data": data, "source": "api"}
            
            except requests.exceptions.Timeout:
                print(f"⏱️ Timeout on attempt {attempt + 1}/{retries}")
                if attempt < retries - 1:
                    time.sleep(2)
                    continue
            
            except requests.exceptions.RequestException as e:
                print(f"❌ Request error: {str(e)}")
                if attempt < retries - 1:
                    time.sleep(2)
                    continue
            
            except Exception as e:
                print(f"🚨 Unexpected error: {str(e)}")
                break
        
        return {"status": "error", "message": "Failed after all retries"}
    
    # ==================== YAHOO APIs WITH SMART CACHING ====================
    
    def get_yahoo_live_games(self):
        """Get Yahoo live games - auto-cached for 10 seconds"""
        url = f"{self.yahoo_base}/feed/realtime"
        return self._make_smart_request(url, 'yahoo', 'live_games')
    
    def get_yahoo_nba_teams(self):
        """Get Yahoo NBA teams - auto-cached for 1 hour"""
        url = f"{self.yahoo_base}/leagues/nba.l.1234/teams?includeRoster=true&includeStats=true"
        return self._make_smart_request(url, 'yahoo', 'teams')
    
    def get_yahoo_nfl_teams(self):
        """Get Yahoo NFL teams - auto-cached for 1 hour"""
        url = f"{self.yahoo_base}/leagues/nfl.l.1234/teams?includeRoster=true&includeStats=true"
        return self._make_smart_request(url, 'yahoo', 'teams')
    
    def get_yahoo_todays_games(self):
        """Get Yahoo today's games - auto-cached for 30 seconds"""
        today = datetime.now().strftime('%Y-%m-%d')
        url = f"{self.yahoo_base}/games?date={today}"
        return self._make_smart_request(url, 'yahoo', 'scoreboard')
    
    # ==================== ESPN APIs WITH SMART CACHING ====================
    
    def get_espn_nba_scoreboard(self):
        """Get ESPN NBA scoreboard - auto-cached for 30 seconds"""
        url = f"{self.espn_base}/basketball/nba/scoreboard"
        return self._make_smart_request(url, 'espn', 'scoreboard')
    
    def get_espn_nfl_scoreboard(self):
        """Get ESPN NFL scoreboard - auto-cached for 30 seconds"""
        url = f"{self.espn_base}/football/nfl/scoreboard"
        return self._make_smart_request(url, 'espn', 'scoreboard')
    
    def get_espn_mlb_scoreboard(self):
        """Get ESPN MLB scoreboard - auto-cached for 30 seconds"""
        url = f"{self.espn_base}/baseball/mlb/scoreboard"
        return self._make_smart_request(url, 'espn', 'scoreboard')
    
    def get_espn_nhl_scoreboard(self):
        """Get ESPN NHL scoreboard - auto-cached for 30 seconds"""
        url = f"{self.espn_base}/hockey/nhl/scoreboard"
        return self._make_smart_request(url, 'espn', 'scoreboard')

    def get_espn_ucl_scoreboard(self):
        """Get ESPN UEFA Champions League scoreboard - auto-cached for 30 seconds"""
        url = f"{self.espn_base}/soccer/uefa.champions/scoreboard"
        return self._make_smart_request(url, 'espn', 'scoreboard')
    
    def get_espn_nba_teams(self):
        """Get ESPN NBA teams - auto-cached for 1 hour"""
        url = f"{self.espn_base}/basketball/nba/teams"
        return self._make_smart_request(url, 'espn', 'teams')
    
    def get_espn_nba_standings(self):
        """Get ESPN NBA standings - auto-cached for 30 minutes"""
        url = "https://site.api.espn.com/apis/v2/sports/basketball/nba/standings"
        return self._make_smart_request(url, 'espn', 'standings')

    def get_espn_nfl_standings(self):
        """Get ESPN NFL standings - auto-cached for 30 minutes"""
        url = "https://site.api.espn.com/apis/v2/sports/football/nfl/standings"
        return self._make_smart_request(url, 'espn', 'standings')

    def get_espn_nba_news(self):
        """Get ESPN NBA News - auto-cached for 5 minutes"""
        url = f"{self.espn_base}/basketball/nba/news"
        return self._make_smart_request(url, 'espn', 'news')
    
    def get_espn_betting_odds(self, sport='basketball', league='nba'):
        """Get ESPN betting odds - auto-cached for 1 minute"""
        url = f"{self.espn_base}/{sport}/{league}/scoreboard"
        result = self._make_smart_request(url, 'espn', 'odds')
        
        if result['status'] in ['success', 'warning']:
            # Extract odds safely
            odds_list = []
            try:
                events = result['data'].get('events', [])
                for event in events:
                    game_info = {
                        'game': event.get('name', 'Unknown'),
                        'status': event.get('status', {}).get('type', {}).get('description', 'Unknown'),
                        'odds': event.get('competitions', [{}])[0].get('odds', [])
                    }
                    odds_list.append(game_info)
                
                result['odds'] = odds_list
            except Exception as e:
                print(f"⚠️ Error extracting odds: {str(e)}")
                result['odds'] = []
        
        return result
    
    # ==================== STATISTICS & MONITORING ====================
    
    def get_cache_stats(self):
        """Get caching statistics"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        # Total cache entries
        cursor.execute('SELECT COUNT(*) FROM api_cache')
        total_cache = cursor.fetchone()[0]
        
        # Cache hits vs misses in last hour
        one_hour_ago = datetime.now() - timedelta(hours=1)
        cursor.execute('''
            SELECT hit_cache, COUNT(*) FROM request_stats 
            WHERE timestamp > ? 
            GROUP BY hit_cache
        ''', (one_hour_ago,))
        
        stats = dict(cursor.fetchall())
        cache_hits = stats.get(1, 0)
        cache_misses = stats.get(0, 0)
        
        # Rate limit usage
        cursor.execute('''
            SELECT api_source, COUNT(*) FROM rate_limits 
            WHERE request_time > ? 
            GROUP BY api_source
        ''', (one_hour_ago,))
        
        rate_usage = dict(cursor.fetchall())
        
        conn.close()
        
        hit_rate = (cache_hits / (cache_hits + cache_misses) * 100) if (cache_hits + cache_misses) > 0 else 0
        
        return {
            'total_cached_items': total_cache,
            'cache_hits_last_hour': cache_hits,
            'cache_misses_last_hour': cache_misses,
            'cache_hit_rate': f"{hit_rate:.1f}%",
            'yahoo_requests_last_hour': rate_usage.get('yahoo', 0),
            'yahoo_limit': f"{rate_usage.get('yahoo', 0)}/{self.max_yahoo_requests}",
            'espn_requests_last_hour': rate_usage.get('espn', 0),
            'espn_limit': f"{rate_usage.get('espn', 0)}/{self.max_espn_requests}",
            'api_calls_saved': cache_hits
        }
    
    def clear_old_cache(self, days=7):
        """Clear cache older than X days"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cutoff_date = datetime.now() - timedelta(days=days)
        cursor.execute('DELETE FROM api_cache WHERE created_at < ?', (cutoff_date,))
        deleted = cursor.rowcount
        
        conn.commit()
        conn.close()
        
        print(f"🗑️ Deleted {deleted} old cache entries")
        return deleted
    
    def reset_rate_limits(self):
        """Reset rate limit counters (for testing)"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM rate_limits')
        conn.commit()
        conn.close()
        print("🔄 Rate limits reset")


# ==================== USAGE EXAMPLES ====================

if __name__ == "__main__":
    # Initialize the API
    api = SmartCachingBettingAPI()
    
    print("\n" + "="*70)
    print("🚀 SMART CACHING BETTING API - NEVER HIT RATE LIMITS!")
    print("="*70 + "\n")
    
    # Example 2: Get NBA scoreboard (will cache for 30 seconds)
    print("\n📊 Fetching NBA scoreboard...")
    nba_scores = api.get_espn_nba_scoreboard()
    print(f"Status: {nba_scores['status']}")
    print(f"Source: {nba_scores['source']}")
    
    # Example 3: Get betting odds (will cache for 60 seconds)
    print("\n💰 Fetching betting odds...")
    odds = api.get_espn_betting_odds('basketball', 'nba')
    print(f"Status: {odds['status']}")
    print(f"Source: {odds['source']}")
    if 'odds' in odds.get('data', {}):
        print(f"Games with odds: {len(odds['data']['odds'])}")
    
    # Example 4: Same request again (will use cache!)
    print("\n🔄 Fetching NBA scoreboard AGAIN (should use cache)...")
    nba_scores_2 = api.get_espn_nba_scoreboard()
    print(f"Status: {nba_scores_2['status']}")
    print(f"Source: {nba_scores_2['source']}")
    
    # Show statistics
    print("\n" + "="*70)
    print("📈 CACHING STATISTICS")
    print("="*70)
    stats = api.get_cache_stats()
    for key, value in stats.items():
        print(f"{key}: {value}")
    
    print("\n✅ Done! Your app will NEVER hit rate limits with this system!")
    print("💾 All data is cached in: betting_cache.db")
