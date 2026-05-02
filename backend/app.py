from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from models import db, Vehiculo, Usuario, Registro, Inspeccion
import os 
from werkzeug.utils import secure_filename
from datetime import datetime


app = Flask(__name__)

CORS(app, supports_credentials=True)


upload_folder = 'uploads'
app.config['UPLOAD_FOLDER'] = upload_folder
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)

with app.app_context():
    db.create_all()


@app.route('/')
def home():
    return {"message": "API funcionando"}




@app.route("/vehiculos", methods=["GET"])
def obtener_vehiculos():
    usuario_id = request.args.get("usuario_id")
    rol = request.args.get("rol")


    if rol == "conductor":
        vehiculos = Vehiculo.query.filter_by(usuario_id=usuario_id).all()
    else:
        vehiculos = Vehiculo.query.all()


    
    resultado = []

    for v in vehiculos:
        resultado.append({
            "id": v.id,
            "patente": v.patente,
            "modelo": v.modelo,
            "imagen": v.imagen,
            "usuario_id": v.usuario_id
        })

    return jsonify({"vehiculos": resultado})




@app.route("/vehiculos", methods=["POST"])
def crear_vehiculo():

    patente = request.form.get("patente")
    modelo = request.form.get("modelo")
    imagen = request.files.get("imagen")
    rol = request.form.get("rol")
    usuario_id = request.form.get("usuario_id")

    nombre_imagen = ""

    if imagen:
        nombre_imagen = imagen.filename
        imagen.save(os.path.join(app.config['UPLOAD_FOLDER'], nombre_imagen))
    
    nuevo = Vehiculo(
        patente=patente,
        modelo=modelo,
        imagen=nombre_imagen,
        rol=rol,
        usuario_id=usuario_id
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify({"message": "Vehículo creado correctamente"})


@app.route("/vehiculos/<int:id>", methods=["DELETE"])
def eliminar_vehiculo(id):
    vehiculo = Vehiculo.query.get(id)

    if vehiculo:
        db.session.delete(vehiculo)
        db.session.commit()
        return jsonify({"message": "Vehículo eliminado correctamente"})

    return jsonify({"message": "Vehículo no encontrado"}), 404

@app.route('/vehiculos/<int:id>', methods=['OPTIONS'])
def options_vehiculo(id):
    return {}, 200


@app.route("/vehiculos/<int:id>", methods=["PUT"])
def actualizar_vehiculo(id):
    vehiculo = Vehiculo.query.get(id)

    vehiculo.patente = request.form.get("patente")
    vehiculo.modelo = request.form.get("modelo")

    vehiculo.usuario_id = request.form.get("usuario_id")

    imagen = request.files.get("imagen")
    if imagen:
        nombre_imagen = imagen.filename
        imagen.save(os.path.join(app.config['UPLOAD_FOLDER'], nombre_imagen))
        vehiculo.imagen = nombre_imagen

    db.session.commit()

    return jsonify({"message": "Vehículo actualizado"})

@app.route("/registro", methods=["POST"])
def registro():
    data = request.json


    rol_solicitante = data.get("rol_solicitante")

    if rol_solicitante != "admin":
        return jsonify({"message": "Acceso denegado"}), 403


    nuevo_usuario = Usuario(
        nombre=data.get("nombre"),
        correo=data.get("correo"),
        password=data.get("password"),
        rol=data.get("rol")
    )

    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify({"message": "Usuario registrado correctamente"})

    
    

@app.route("/login", methods=["POST"])
def login():
    data = request.json

    correo = data.get("correo")
    password = data.get("password")


    usuario = Usuario.query.filter_by(correo=correo).first()

    if usuario and usuario.password == password:
        return jsonify({
            "id": usuario.id,
            "nombre": usuario.nombre,
            "rol": usuario.rol
        })
    return jsonify({"message": "Credenciales inválidas"}), 401

        



@app.route('/uploads/<filename>')
def obtener_imagen(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)





@app.route("/usuarios", methods=["GET"])
def obtener_usuarios():
    usuarios = Usuario.query.all()
    
    resultado = []

    for u in usuarios:
        if u.rol == "conductor":
            resultado.append({
                "id": u.id,
                "nombre": u.nombre
        })

    return jsonify({"usuarios": resultado})


@app.route("/registro/inicio", methods=["POST"])
def iniciar_registro():
    data = request.json  

    vehiculo_id = data.get("vehiculo_id")
    conductor = data.get("conductor")

    nuevo = Registro(
        vehiculo_id=vehiculo_id,
        conductor=conductor,
        fecha=datetime.now().strftime("%Y-%m-%d"),
        hora_inicio=datetime.now().strftime("%H:%M:%S")
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify({
        "message": "Inicio registrado",
        "registro_id": nuevo.id
    })

@app.route("/registro/fin/<int:vehiculo_id>", methods=["PUT"])
def finalizar_registro(vehiculo_id):

    registro = Registro.query.filter_by(vehiculo_id=vehiculo_id).order_by(Registro.id.desc()).first()

    if not registro:
        return jsonify({"message": "Registro no encontrado"}), 404

    imagen = request.files.get("foto_fin")

    if imagen:
        nombre_imagen = imagen.filename
        imagen.save(os.path.join(app.config['UPLOAD_FOLDER'], nombre_imagen))
        registro.foto_fin = nombre_imagen

    registro.hora_fin = datetime.now().strftime("%H:%M:%S")

    db.session.commit()

    return jsonify({"message": "Fin registrado", "registro_id": registro.id})


@app.route("/registros", methods=["GET"])
def obtener_registros():
    registros = Registro.query.all()
    resultado = []

    for r in registros:
        inspeccion = Inspeccion.query.filter_by(registro_id=r.id).first()
        resultado.append({
            "id": r.id,
            "vehiculo_id": r.vehiculo_id,
            "conductor": r.conductor,
            "fecha": r.fecha,
            "hora_inicio": r.hora_inicio,
            "hora_fin": r.hora_fin,
            "foto_inicio": r.foto_inicio,
            "foto_fin": r.foto_fin,

            "inspeccion":{
                "bencina": inspeccion.bencina,
                "aceite": inspeccion.aceite,
                "revision_tecnica": inspeccion.revision_tecnica,
                "papeles": inspeccion.papeles,
                "observaciones": inspeccion.observaciones

            }if inspeccion else None
        })

    return jsonify({"registros": resultado})

@app.route("/inspeccion", methods=["POST"])
def crear_inspeccion():
    data = request.json

    nuevo = Inspeccion(
        registro_id=data.get("registro_id"),
        bencina=data.get("bencina"),
        aceite=data.get("aceite"),
        revision_tecnica=data.get("revision_tecnica"),
        papeles=data.get("papeles"),
        observaciones=data.get("observaciones"),
        fecha=datetime.now().strftime("%Y-%m-%d")
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify({"message": "Inspección guardada correctamente"})
    



if __name__ == '__main__':
    app.run(debug=True)


