from flask import Flask, send_from_directory, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.secret_key = "supersecret"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pgs.db'
db = SQLAlchemy(app)

class PG(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    location = db.Column(db.String(120))
    stars = db.Column(db.Integer)
    rate = db.Column(db.Integer)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), unique=True)
    password = db.Column(db.String(40))

@app.before_first_request
def add_default_pgs():
    if PG.query.count() == 0:
        demo_pgs = [
          {"name": "Sunrise Homes", "location": "Kalinga Vihar", "stars": 5, "rate": 5500},
          {"name": "Blue Meadow PG", "location": "Chhend Colony", "stars": 4, "rate": 4800},
          {"name": "StudentXpress PG", "location": "Udit Nagar", "stars": 4, "rate": 4600},
          {"name": "Saffron Stay", "location": "Koel Nagar", "stars": 5, "rate": 6200},
          {"name": "City Edge PG", "location": "Sector 5", "stars": 3, "rate": 3900},
          {"name": "GreenNest Boys PG", "location": "Basanti Colony", "stars": 4, "rate": 4100}
        ]
        for pg in demo_pgs:
            db.session.add(PG(**pg))
        db.session.commit()
    if User.query.count() == 0:
        db.session.add(User(username="student", password="12345"))
        db.session.commit()

@app.route("/")
def home():
    return send_from_directory(os.getcwd(), "index.html")

@app.route("/styles.css")
def styles():
    return send_from_directory(os.getcwd(), "styles.css")

@app.route("/script.js")
def script():
    return send_from_directory(os.getcwd(), "script.js")

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"], password=data["password"]).first()
    if user:
        session["username"] = user.username
        return jsonify({"success":True, "username":user.username})
    return jsonify({"success":False, "error":"Invalid credentials."})

@app.route("/logout")
def logout():
    session.pop("username", None)
    return jsonify({"success":True})

@app.route("/api/pgs")
def get_pgs():
    q = request.args.get('q', "").lower()
    results = []
    for pg in PG.query.all():
        if q in pg.name.lower() or q in pg.location.lower():
            results.append({
                "name": pg.name, "location": pg.location,
                "stars": pg.stars, "rate": pg.rate
            })
    return jsonify(results)

if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)
