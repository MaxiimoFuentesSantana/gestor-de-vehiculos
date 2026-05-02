from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Vehiculo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patente = db.Column(db.String(50))
    modelo = db.Column(db.String(50))
    imagen = db.Column(db.String(200))
    rol = db.Column(db.String(50))
    
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50))
    correo = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    rol = db.Column(db.String(50))

class Registro(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    vehiculo_id = db.Column(db.Integer, db.ForeignKey('vehiculo.id'))
    conductor = db.Column(db.String(100))

    fecha = db.Column(db.String(50))

    foto_inicio = db.Column(db.String(200))
    hora_inicio = db.Column(db.String(50))

    foto_fin = db.Column(db.String(200))
    hora_fin = db.Column(db.String(50))

class Inspeccion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    registro_id = db.Column(db.Integer, nullable=False)
    bencina = db.Column(db.String(50))
    aceite = db.Column(db.String(50))
    revision_tecnica = db.Column(db.String(50))
    papeles = db.Column(db.String(50))
    observaciones = db.Column(db.Text)

    fecha = db.Column(db.String(50))
