from flask import Flask, request
from models import db

app = Flask(__name__)

@app.route('/')
def home():
    return {"message": "API funcionando"}

if __name__ == '__main__':
    app.run(debug=True)


app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.db"
db_init_app(app)
with app.app_context():
    db.create_all()

@app.route("/vehiculos", methods=["GET"])
def obtener_vehiculos():
    return {"vehiculos": []}

@app.route("/registro", methods=["POST"])
def crear_registro():
    data = request.json
    return {"message": "Registro creado"}