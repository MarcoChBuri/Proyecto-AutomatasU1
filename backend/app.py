from flask import Flask
from flask_cors import CORS
from api.routes import api_bp
import os

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    app.register_blueprint(api_bp, url_prefix='/api/v1')
    
    @app.route('/')
    def health_check():
        return {"status": "online", "project": "DNA-Analyzer-AFD"}, 200
        
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)