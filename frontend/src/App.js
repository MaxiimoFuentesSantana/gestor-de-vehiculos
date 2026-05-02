import { useEffect, useState } from "react";
import "./App.css";
import { useRef } from "react";




function App() {
  const formRef = useRef(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [patente, setPatente] = useState("");
  const [modelo, setModelo] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [imagen, setImagen] = useState("");
  const [rol, setRol] = useState("conductor");
  const [nombre, setNombre] = useState("");
  const [rolRegistro, setRolRegistro] = useState("conductor");
  const [usuario, setUsuario] = useState(null);
  const [correo , setCorreo] = useState("");
  const [password , setPassword] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [fotoInicio, setFotoInicio] = useState(null);
  const [fotoFin, setFotoFin] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [registroActual, setRegistroActual] = useState(null);
  const [bencina, setBencina] = useState("");
  const [aceite, setAceite] = useState("");
  const [revisionTecnica, setRevisionTecnica] = useState("");
  const [papeles, setPapeles] = useState("");
  const [obs, setObs] = useState("");
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [imagenFull, setImagenFull] = useState(null);
  const [historialAbierto, setHistorialAbierto] = useState({});
  const [mostrarModalInspeccion, setMostrarModalInspeccion] = useState(false);


  useEffect(() => {
  obtenerVehiculo();

  fetch("http://127.0.0.1:5000/usuarios")
    .then(res => res.json())
    .then(data => setUsuarios(data.usuarios));

  fetch("http://127.0.0.1:5000/registros")
    .then(res => res.json())
    .then(data => setRegistros(data.registros));
  
  

}, [usuario]);
useEffect(() => {
  if (usuario?.rol === "admin") {
    setNombre("");
    setCorreo("");
    setPassword("");
    setRolRegistro("conductor");
  }
}, [usuario]);

  const login = () => {
     fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ correo, password })
    })
    .then(res => {
      if (!res.ok) throw new Error("Error en el login");
      return res.json();
    
    })
    .then(data => {
      setUsuario(data);
    })
    .catch(() => alert("Credenciales incorrectas"));
  };


  const obtenerVehiculo = () => {
    if (!usuario) return;
    fetch(`http://127.0.0.1:5000/vehiculos?usuario_id=${usuario.id}&rol=${usuario.rol}`)
      .then(res => res.json())
      .then(data => setVehiculos(data.vehiculos));
  };

  const crearVehiculo = () => {
    const formData = new FormData();
    formData.append("patente", patente);
    formData.append("modelo", modelo);
    formData.append("imagen", imagen);
    formData.append("rol", rol);
    formData.append("usuario_id", usuarioSeleccionado);

    fetch("http://127.0.0.1:5000/vehiculos", {
      method: "POST",
      body: formData
    })
    .then(() => {
      obtenerVehiculo();
      setPatente("");
      setModelo("");
      setImagen(null);
    });
  };

const eliminarVehiculo = (id) => {
  fetch(`http://127.0.0.1:5000/vehiculos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(() => obtenerVehiculo());
};

const actualizarVehiculo = () => {
  const formData = new FormData();
  formData.append("patente", patente);
  formData.append("modelo", modelo);
  formData.append("imagen", imagen);

  formData.append("usuario_id", usuarioSeleccionado);

  fetch(`http://127.0.0.1:5000/vehiculos/${editandoId}`, {
    method: "PUT",
    body: formData
  })
  .then(() => {
    obtenerVehiculo();
    setEditandoId(null);
    setPatente("");
    setModelo("");
    setImagen(null);
    setUsuarioSeleccionado("");
  });
};

const registrarUsuario = () => {
  fetch("http://127.0.0.1:5000/registro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre,
      correo,
      password,
      rol: rolRegistro,
      rol_solicitante: usuario.rol
    })
  })
  .then(() => {
    alert("Usuario registrado exitosamente");
    setNombre("");
    setCorreo("");
    setPassword("");


  });




};

const iniciarUso = (vehiculo_id) => {
  fetch("http://127.0.0.1:5000/registro/inicio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      vehiculo_id: vehiculo_id,
      conductor: usuario.nombre 
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Iniciado:", data);
  })
  .catch(() => alert("Error al iniciar"));
};

const finalizarUso = (vehiculo_id) => {
  const formData = new FormData();

  if (fotoFin) {
    formData.append("foto_fin", fotoFin);
  }

  fetch(`http://127.0.0.1:5000/registro/fin/${vehiculo_id}`, {
    method: "PUT",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    console.log("Respuesta:", data);

    setRegistroActual(data.registro_id);
    setMostrarModal(true);
  })
  .catch(err => console.error(err));
};



const guardarInspeccion = () => {
  console.log("registroActual:", registroActual); 
  fetch("http://127.0.0.1:5000/inspeccion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      registro_id: registroActual,
      bencina,
      aceite,
      revision_tecnica: revisionTecnica,
      papeles,
      observaciones: obs
    })
  })
  .then(res => res.json())
  .then(() => {
    alert("Inspección guardada");
    setMostrarModal(false);
  })
  .catch(() => alert("Error al guardar"));
};
    

  if (!usuario) {
  return (
    <div className="login-container">
      <div className="login-box">
      <h1>Login</h1>

      <input
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Ingresar</button>
    </div>
    </div>
  );
}

  return (
  <div className="app-container">

    <h1 className="titulo">Gestor de Vehículos</h1>

    {usuario.rol === "conductor" ? (
      <>
        <h2 className="subtitulo">Vista Conductor</h2>

        <div className="conductor-container">
  {vehiculos.map((v) => (
    <div key={v.id} className="conductor-card">

      <p className="vehiculo-titulo">
        {v.patente} - {v.modelo}
      </p>

      {v.imagen && (
        <img 
          src={`http://127.0.0.1:5000/uploads/${v.imagen}`} 
          className="conductor-img"
          alt="vehiculo"
        />
      )}

      <div className="input-group">
        <input
          type="file"
          onChange={(e) => setFotoInicio(e.target.files[0])}
        />
        <button 
          className="btn-iniciar"
          onClick={() => iniciarUso(v.id)}
        >
          Iniciar
        </button>
      </div>

      <div className="input-group">
        <input
          type="file"
          onChange={(e) => setFotoFin(e.target.files[0])}
        />
        <button 
          className="btn-finalizar"
          onClick={() => finalizarUso(v.id)}
        >
          Finalizar
        </button>
      </div>

    </div>
  ))}
</div>
      </>
    ) : (
      <>
        <h2 className="subtitulo"> 
          {usuario.rol === "admin" ? "Vista Admin" : "Vista Supervisor"}
        </h2>

        {/* FORMULARIO */}
        <div className="form-container" ref={formRef}>

          {usuario.rol === "admin" && (
            <div className="form-section">
              <h3>Registrar Usuario</h3>
              
              <input
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              
              <input
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <select
                value={rolRegistro}
                onChange={(e) => setRolRegistro(e.target.value)}
              >
                <option value="conductor">Conductor</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Admin</option>
              </select>

              <button onClick={registrarUsuario}>Crear usuario</button>
            </div>
          )}

          <h3>{editandoId ? "Editar Vehículo" : "Agregar Vehículo"}</h3>

          <input 
            placeholder="Patente"
            value={patente}
            onChange={(e) => setPatente(e.target.value)}
          />

          <input
            placeholder="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setImagen(e.target.files[0])}
          />

          <select 
            value={usuarioSeleccionado}
            onChange={(e) => setUsuarioSeleccionado(e.target.value)}
          >
            <option value="">Seleccionar conductor</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>

          {editandoId ? (
            <button onClick={actualizarVehiculo}>Actualizar</button>
          ) : (
            <button onClick={crearVehiculo}>Guardar</button>
          )}

        </div>

        {/* VEHICULOS */}
        <div className="vehiculos-container">
  {vehiculos.map((v) => (
    <div key={v.id} className="vehiculo-card">

      <h3>{v.patente}</h3>
      <p>{v.modelo}</p>

      {v.imagen && (
        <img 
          src={`http://127.0.0.1:5000/uploads/${v.imagen}`} 
          className="vehiculo-img"
        />
      )}

      <div className="botones">
        <button onClick={() => eliminarVehiculo(v.id)}>
          Eliminar
        </button>

        <button onClick={() => {
  setEditandoId(v.id);
  setPatente(v.patente);
  setModelo(v.modelo);

  formRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}}>
  Editar
</button>
      </div>

      <button
        className="btn-historial"
        onClick={() =>
          setHistorialAbierto(prev => ({
            ...prev,
            [v.id]: !prev[v.id]
          }))
        }
      >
        Ver historial
      </button>

      {historialAbierto[v.id] && (
        <div className="historial">
          {registros
            .filter(r => r && r.vehiculo_id === v.id)
            .map((r) => (
              <div key={r.id} className="historial-item">

                <p><strong>{r.conductor}</strong></p>
                <p>{r.fecha}</p>
                <p>Inicio: {r.hora_inicio}</p>
                <p>Fin: {r.hora_fin}</p>

                <button
                  onClick={() => setRegistroSeleccionado(r)}
                  className="btn-detalle"
                >
                  Ver detalle
                </button>

              </div>
            ))}
        </div>
      )}

    </div>
  ))}
</div>

      </>
    )}

    {registroSeleccionado && (
  <div 
    className="modal-overlay"
    onClick={() => setRegistroSeleccionado(null)}
  >

    <div 
      className="modal-pro"
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}
      <div className="modal-header">
        <h3>Detalle del Registro</h3>
        <button 
          className="close-btn"
          onClick={() => setRegistroSeleccionado(null)}
        >
          ✕
        </button>
      </div>

      {/* BODY CON SCROLL */}
      <div className="modal-body">

        <div className="grid">
          <p><strong>Conductor:</strong> {registroSeleccionado.conductor}</p>
          <p><strong>Fecha:</strong> {registroSeleccionado.fecha}</p>
          <p><strong>Inicio:</strong> {registroSeleccionado.hora_inicio}</p>
          <p><strong>Fin:</strong> {registroSeleccionado.hora_fin}</p>
        </div>

        {/* INSPECCIÓN */}
        {registroSeleccionado.inspeccion && (
          <div className="inspeccion-pro">
            <h4>Inspección</h4>

            <p>
              <strong>Bencina:</strong>{" "}
              <span className={
                registroSeleccionado.inspeccion.bencina < 25 ? "Rojo" : "Verde"
              }>
                {registroSeleccionado.inspeccion.bencina}%
              </span>
            </p>

            <p>
              <strong>Aceite:</strong>{" "}
              <span className={
                registroSeleccionado.inspeccion.aceite === "Bajo" ? "Rojo" : "Verde"
              }>
                {registroSeleccionado.inspeccion.aceite}
              </span>
            </p>

            <p>
              <strong>Revisión Técnica:</strong>{" "}
              <span className={
                new Date(registroSeleccionado.inspeccion.revision_tecnica) < new Date()
                  ? "Rojo"
                  : "Verde"
              }>
                {registroSeleccionado.inspeccion.revision_tecnica}
              </span>
            </p>

            <p>
              <strong>Papeles:</strong>{" "}
              <span className={
                registroSeleccionado.inspeccion.papeles === "faltan" ? "Rojo" : "Verde"
              }>
                {registroSeleccionado.inspeccion.papeles}
              </span>
            </p>

            <p>
              <strong>Observaciones:</strong>{" "}
              {registroSeleccionado.inspeccion.observaciones}
            </p>
          </div>
        )}

        {/* COMPARADOR */}
        {registroSeleccionado.foto_inicio && registroSeleccionado.foto_fin && (
  <div className="comparacion-doble">

    {/* ANTES */}
    <div className="foto-box">
      <span className="label">Antes</span>
      <img
        src={`http://127.0.0.1:5000/uploads/${registroSeleccionado.foto_inicio}`}
        onClick={() =>
          setImagenFull(`http://127.0.0.1:5000/uploads/${registroSeleccionado.foto_inicio}`)
        }
      />
    </div>

    {/* DESPUÉS */}
    <div className="foto-box">
      <span className="label">Después</span>
      <img
        src={`http://127.0.0.1:5000/uploads/${registroSeleccionado.foto_fin}`}
        onClick={() =>
          setImagenFull(`http://127.0.0.1:5000/uploads/${registroSeleccionado.foto_fin}`)
        }
      />
    </div>


  </div>
)}

      </div>

    </div>
  </div>
)}
{imagenFull && (
  <div className="modal-img active" onClick={() => setImagenFull(null)}>
    <img src={imagenFull} className="img-zoom" />
  </div>
)}
{mostrarModal && (
  <div className="modal">
    <div className="modal-box">

      <h3>Inspección del Vehículo</h3>

      <input
        placeholder="Bencina (%)"
        value={bencina}
        onChange={(e) => setBencina(e.target.value)}
      />

      <select value={aceite} onChange={(e) => setAceite(e.target.value)}>
        <option value="">Aceite</option>
        <option value="OK">OK</option>
        <option value="Bajo">Bajo</option>
      </select>

      <input
        type="date"
        value={revisionTecnica}
        onChange={(e) => setRevisionTecnica(e.target.value)}
      />

      <select value={papeles} onChange={(e) => setPapeles(e.target.value)}>
        <option value="">Papeles</option>
        <option value="OK">OK</option>
        <option value="faltan">Faltan</option>
      </select>

      <textarea
        placeholder="Observaciones"
        value={obs}
        onChange={(e) => setObs(e.target.value)}
      />

      <button onClick={guardarInspeccion}>
        Guardar inspección
      </button>

      <button onClick={() => setMostrarModal(false)}>
        Cancelar
      </button>

    </div>
  </div>
)}
  </div>
);



}



export default App;