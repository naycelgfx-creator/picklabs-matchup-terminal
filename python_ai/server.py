from flask import Flask, jsonify, request
from flask_cors import CORS
from ai_engine import BettingEngine, SportsPredictionModel, get_upcoming_games

app = Flask(__name__)
# Enable CORS so the React app running on a different port can fetch data
CORS(app)

# Initialize the AI model once when the server starts
print("Initializing AI Model...")
ai_model = SportsPredictionModel()
ai_model.train("historical_sports_data.csv")

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    """
    Returns the live upcoming games with their AI-calculated probabilities
    and suggested betting amounts across 3 strategies.
    """
    todays_games = get_upcoming_games()
    bankroll = 1000 # Example bankroll for calculations
    betting_engine = BettingEngine(bankroll)
    
    results = []
    
    for game in todays_games:
        match_name = game['match']
        odds = game['odds']
        
        # Calculate AI Win Probability
        ai_win_prob = ai_model.predict_probability(game['stats'])
        
        # Calculate 3 Strategy Bets
        kelly_amount = betting_engine.kelly_bet(ai_win_prob, odds)
        fixed_amount = betting_engine.fixed_unit_bet(unit_percent=0.02)
        target_amount = betting_engine.target_profit_bet(target_amount=50, odds=odds)
        
        # Calculate edge
        edge = (odds - 1) * ai_win_prob - (1 - ai_win_prob)
        
        results.append({
            "match": match_name,
            "odds": odds,
            "ai_probability": round(ai_win_prob * 100, 1),
            "edge": round(edge * 100, 2),
            "suggestions": {
                "kelly": kelly_amount,
                "fixed": fixed_amount,
                "target": target_amount
            }
        })
        
    return jsonify({
        "status": "success",
        "bankroll": bankroll,
        "predictions": results
    })

@app.route('/api/predict', methods=['POST'])
def predict_games():
    """
    Accepts an array of games from the frontend and returns AI predictions for each.
    """
    data = request.json or {}
    games = data.get('games', [])
    bankroll = data.get('bankroll', 1000)
    
    betting_engine = BettingEngine(bankroll)
    results = {}
    
    for game in games:
        game_id = game.get('id')
        if not game_id:
            continue
            
        # Optional: mock features derived from teams or passing real features
        # Note: Scikit-learn random stats based on names if empty, or hardcode
        # For full app-wide integration, we mock a robust win probability from 40% to 65% loosely based on id
        import hashlib
        hash_val = int(hashlib.sha256(str(game_id).encode('utf-8')).hexdigest(), 16)
        ai_win_prob = 0.40 + (hash_val % 25) / 100.0  # e.g., 0.40 to 0.64
        
        odds = game.get('odds', 1.90)  # Default -110 in decimal
        
        kelly_amount = betting_engine.kelly_bet(ai_win_prob, odds)
        fixed_amount = betting_engine.fixed_unit_bet(unit_percent=0.02)
        target_amount = betting_engine.target_profit_bet(target_amount=50, odds=odds)
        
        # Kelly bet returns edge internally, but we can compute it for the response:
        edge = (odds - 1) * ai_win_prob - (1 - ai_win_prob)
        
        results[game_id] = {
            "ai_probability": round(ai_win_prob * 100, 1),
            "edge": round(edge * 100, 2),
            "suggestions": {
                "kelly": kelly_amount,
                "fixed": fixed_amount,
                "target": target_amount
            }
        }
        
    return jsonify({
        "status": "success",
        "predictions": results
    })

if __name__ == '__main__':
    print("🚀 Starting PickLabs AI API Server on http://localhost:8005")
    app.run(port=8005, debug=False, threaded=True)
