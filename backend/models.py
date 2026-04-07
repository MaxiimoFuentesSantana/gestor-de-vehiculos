from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Vehiculo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patente = db.column(db.String(15))
    modelo = db.Column(db.String(50))

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50))
    rol = db.Column(db.String(50))

class Registro(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vehiculo_id = db.Column(db.Integer)
    usuario_id = db.Column(db.Integer)
    combustible = db.Column(db.String(30))
    observaciones = db.Column(db.String(200))
    imagen_inicio = db.Column(db.String(200))
    imagen_fin = db.Column(db.String(200))
