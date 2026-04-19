import { useEffect, useState } from "react";
import "./App.css";


function App() {
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

  useEffect(() => {
  obtenerVehiculo();

  fetch("http://127.0.0.1:5000/usuarios")
    .then(res => res.json())
    .then(data => setUsuarios(data.usuarios));

  fetch("http://127.0.0.1:5000/registros")
    .then(res => res.json())
    .then(data => setRegistros(data.registros));

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
  if (imagen) {
    formData.append("imagen", imagen);
  }

  fetch(`http://127.0.0.1:5000/vehiculos/${editandoId}`, {
    method: "PUT",
    body: formData
  })
  .then(() => {
    obtenerVehiculo();
    setPatente("");
    setModelo("");
    setImagen(null);
    setEditandoId(null);
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
      rol: rolRegistro
    })
  })
  .then(() => {
    alert("Usuario registrado exitosamente");
    setNombre("");
    setCorreo("");
    setPassword("");


  });




};

const iniciarUso = (vehiculoId) => {

    const formData = new FormData();
    formData.append("vehiculo_id", vehiculoId);
    formData.append("conductor", usuario.nombre);
    formData.append("foto_inicio", fotoInicio);

    fetch("http://127.0.0.1:5000/registro/inicio",{
      method: "POST",
      body: formData
    })
    .then(() => alert("Inicio registrado"));

    };
  
  const finalizarUso = (vehiculoId) => {

    const formData = new FormData();
    formData.append("foto_fin", fotoFin);
    
    fetch(`http://127.0.0.1:5000/registro/fin/${vehiculoId}`,{
      method: "PUT",
      body: formData
    })
    .then(() => alert("Fin registrado"));
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

        {vehiculos.map((v) => (
          <div key={v.id}>
            <p>{v.patente} - {v.modelo}</p>

            {v.imagen && (
              <img 
                src={`http://127.0.0.1:5000/uploads/${v.imagen}`} 
                width="200"
              />
            )}

            <input
              type="file"
              onChange={(e) => setFotoInicio(e.target.files[0])}
            />
            <button onClick={() => iniciarUso(v.id)}>Iniciar</button>

            <input
              type="file"
              onChange={(e) => setFotoFin(e.target.files[0])}
            />
            <button onClick={() => finalizarUso(v.id)}>Finalizar</button>
          </div>
        ))}
      </>
    ) : (
      <>
        <h2 className="subtitulo">Vista Supervisor</h2>

{/* FORMULARIO ARRIBA */}
<div className="form-container">
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

{/* VEHICULOS ABAJO */}
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
        }}>
          Editar
        </button>
      </div>

      <button
        className="btn-historial"
        onClick={() =>
          setVehiculoSeleccionado(
            vehiculoSeleccionado === v.id ? null : v.id
          )
        }
      >
        Ver historial
      </button>

      {vehiculoSeleccionado === v.id && (
        <div className="historial">
          {registros
            .filter(r => r.vehiculo_id === v.id)
            .map((r, index) => (
              <div key={index} className="historial-item">
                <p><strong>{r.conductor}</strong></p>
                <p>{r.fecha}</p>
                <p>Inicio: {r.hora_inicio}</p>
                <p>Fin: {r.hora_fin}</p>
              </div>
          ))}
        </div>
      )}

    </div>
  ))}
</div>
      </> 
      
    )}
  </div>
);

}


export default App;