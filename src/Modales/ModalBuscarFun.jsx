import React, { useState, useEffect } from "react";

const ModalBuscarModificar = ({ isOpen, onClose, funcionario, rut, onGuardar }) => {
  const [datos, setDatos] = useState({
    nombre_funcionario: "",
    email: "",
  });

  useEffect(() => {
    if (funcionario) {
      setDatos({
        nombre_funcionario: funcionario.nombre_funcionario,
        email: funcionario.email,
      });
    }
  }, [funcionario]);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    onGuardar(datos); // Envía los datos actualizados al componente padre
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">X</button>
        <h2>Editar Datos del Funcionario</h2>
        {funcionario ? (
          <form>
            <label>RUT:</label>
            <input type="text" value={rut} readOnly />
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre_funcionario"
              value={datos.nombre}
              onChange={handleChange}
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={datos.email}
              onChange={handleChange}
            />
            <button type="button" onClick={handleGuardar}>
              Guardar Cambios
            </button>
          </form>
        ) : (
          <p>No se encontraron datos para este RUT.</p>
        )}
      </div>
    </div>
  );
};

export default ModalBuscarModificar;
