import React, { useState, useEffect } from "react";
import "./ModalBuscar.scss"

const ModalBuscarModificar = ({
  isOpen,
  onClose,
  funcionario,
  rut,
  onGuardar,
}) => {
  const [datos, setDatos] = useState({
    
    nombre_completo: "",
    email: "",
    fecha_nacimiento:"",
    estado_civil: "",
    domicilio:"",
    estudios:"",
    nacionalidad:"",
    telefono:"",
    afp:"",
    salud:"",
    alergico:"",
    banco:"",
    tipo_cuenta:"",
    num_cuenta:"",
    contacto_emergencia:"",
    direccion_emergencia:"",
    telefono_emergencia:"",
    num_hijos:"",
    jornada: "",
    tipo_contrato: "",
    instalacion: "",
    ubicacion: "",
    horario: "",
    sueldo: "",
    fecha_ingreso: "",
    camisa: "",
    parka: "",
    polar: "",
    pantalon: "",
    zapatos: "",
    

  });

 

  const [activeSection, setActiveSection] = useState(null); // Estado para controlar qué sección está activa

  useEffect(() => {
    if (funcionario) {
      setDatos({
        
        nombre_completo: funcionario.nombre_completo,
        email: funcionario.email,
        fecha_nacimiento: funcionario.fecha_nacimiento,
        estado_civil: funcionario.estado_civil,
        domicilio: funcionario.domicilio,
        estudios: funcionario.estudios,
        nacionalidad: funcionario.nacionalidad,
        telefono: funcionario.telefono,
        afp: funcionario.afp,
        salud: funcionario.salud,
        alergico: funcionario.alergico,
        banco: funcionario.banco,
        tipo_cuenta: funcionario.tipo_cuenta,
        num_cuenta: funcionario.num_cuenta,
        contacto_emergencia: funcionario.contacto_emergencia,
        direccion_emergencia: funcionario.direccion_emergencia,
        telefono_emergencia: funcionario.telefono_emergencia,
        num_hijos: funcionario.num_hijos,
        jornada: funcionario.jornada,
        tipo_contrato: funcionario.tipo_contrato,
        instalacion: funcionario.instalacion,
        ubicacion: funcionario.ubicacion,
        horario: funcionario.horario,
        sueldo: funcionario.sueldo,
        fecha_ingreso: funcionario.fecha_ingreso,
        camisa: funcionario.camisa,
        parka: funcionario.parka,
        polar: funcionario.polar,
        pantalon: funcionario.pantalon,
        zapatos: funcionario.zapatos,
        
      });
    }
  }, [funcionario]);
   
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section); // Alterna la visibilidad de la sección
  };

  // const handleChange = (e) => {
  //   setDatos({ ...datos, [e.target.name]: e.target.value });
  //   console.log("handleeee", datos)
    
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prevDatos) => ({
      ...prevDatos,
      [name]: value, // Actualiza el estado para el campo correspondiente
    }));
  };
  
  

  // const handleGuardar = async () => {
  //   onGuardar(datos); 
  //   try {
  //     const response = await fetch(`http://127.0.0.1:8000/api/funcionarios/${rut}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(datos),
  //     });
  
  //     if (response.ok) {
  //       const result = await response.json();
  //       console.log("Funcionario actualizado:", result.funcionario);
  //     } else {
  //       console.error("Error al actualizar el funcionario");
  //     }
  //   } catch (error) {
  //     console.error("Error de red:", error);
  //   }
  // };

  const handleGuardar = async () => {
    // Validar y transformar datos antes de enviarlos
    const datosValidados = validarDatos(datos);
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/funcionarios/${rut}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosValidados),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Funcionario actualizado:", result.funcionario);
      } else {
        console.error("Error al actualizar el funcionario");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };
  
  // Función para validar y transformar datos
  const validarDatos = (datos) => {
    const datosValidados = { ...datos };
  
    // Formatear fechas (de DD/MM/YYYY a YYYY-MM-DD)
    if (datos.fecha_nacimiento) {
      datosValidados.fecha_nacimiento = formatearFecha(datos.fecha_nacimiento);
    }
    if (datos.fecha_ingreso) {
      datosValidados.fecha_ingreso = formatearFecha(datos.fecha_ingreso);
    }
    if (datos.cursoos10) {
      datosValidados.cursoos10 = formatearFecha(datos.cursoos10);
    }
  
    // Limpiar caracteres inválidos en texto
    for (let key in datosValidados) {
      if (typeof datosValidados[key] === "string") {
        datosValidados[key] = datosValidados[key]
          .replace(/[^\w\s.@-]/gi, "") // Quita caracteres no permitidos
          .trim(); // Quita espacios adicionales
      }
    }
  
    // Convertir sueldo a número
    if (datosValidados.sueldo) {
      datosValidados.sueldo = parseFloat(
        datosValidados.sueldo.toString().replace(/[^\d.]/g, "") // Quita símbolos como $
      );
    }
  
    // Omitir campos vacíos o no válidos
    Object.keys(datosValidados).forEach((key) => {
      if (datosValidados[key] === null || datosValidados[key] === "" || datosValidados[key] === undefined) {
        delete datosValidados[key];
      }
    });
  
    return datosValidados;
  };
  
  // Función auxiliar para formatear fechas
  const formatearFecha = (fecha) => {
    // Asume formato DD/MM/YYYY; convertir a YYYY-MM-DD
    const partes = fecha.split("/");
    if (partes.length === 3) {
      const [dia, mes, anio] = partes;
      return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
    }
    return fecha; // Retorna la fecha sin cambios si el formato no coincide
  };
  

  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">
          X
        </button>
        <h2>Datos del Funcionario</h2>
        {funcionario ? (
          <form>
            {/* Sección de Datos Personales */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection("datosPersonales")}
              >
                Datos Personales
              </button>
              {activeSection === "datosPersonales" && (
                <div className="section-content">
                  <label>RUT:</label>
                  <input type="text" value={rut} onChange={handleChange}/>
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="nombre_completo"
                    value={datos.nombre_funcionario}
                    onChange={handleChange}
                  />
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={datos.email}
                    onChange={handleChange}
                  />
                  <label>Fecha de nacimiento:</label>
                  <input 
                    type="text" 
                    name="fecha_nacimiento"
                    value={datos.fecha_nacimiento}
                    onChange={handleChange}
                   />
                  <label>Estado Civil:</label>
                  <input 
                    type="text"
                    name="estado_civil"
                    value={datos.estado_civil}
                    onChange={handleChange}
                   />
                  <label>Domicilio:</label>
                  <input 
                    type="text"
                    name="domicilio"
                    value={datos.domicilio} 
                    onChange={handleChange}
                  />
                  <label>Estudios:</label>
                  <input 
                    type="text" 
                    name="estudios"
                    value={datos.estudios}
                    onChange={handleChange}
                  />
                  <label>Nacionalidad:</label>
                  <input 
                    type="text"
                    name="nacionalidad"
                    value={datos.nacionalidad}
                    onChange={handleChange} 
                  />
                  <label>Telefono:</label>
                  <input 
                    type="text"
                    name="telefono"
                    value={datos.telefono}
                    onChange={handleChange} 
                  />
                </div>
              )}
            </div>

            {/* Sección prevision social */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection("prevision_social")}
              >
                Previsión Social
              </button>
              {activeSection === "prevision_social" && (
                <div className="section-content">
                  <label>AFP:</label>
                    <input
                      type="text"
                      name="afp"
                      value={datos.afp}
                      onChange={handleChange}
                    />
                  <label>Salud:</label>
                    <input 
                    type="text"
                    name="salud"
                    value={datos.salud}
                    onChange={handleChange} 
                    />
                  <label>Alergico:</label>
                    <input 
                    type="text"
                    name="alergico"
                    value={datos.alergico}
                    onChange={handleChange} 
                    />
                </div>
              )}
            </div>
              {/*Datos Bancarios*/}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("datos_bancarios")}>
                      Datos Bancarios
                    </button>
                    {activeSection === "datos_bancarios" && (
                      <div className="section-content">
                        <label >Banco:</label>
                          <input 
                            type="text"
                            name="banco"
                            value={datos.banco}
                            onChange={handleChange}
                          />
                        <label>Tipo de cuenta</label>
                          <input 
                              type="text"
                              name="tipo_cuenta"
                              value={datos.tipo_cuenta}
                              onChange={handleChange}
                            />
                        <label>N° de cuenta</label>
                        <input 
                            type="text"
                            name="num_cuenta"
                            value={datos.num_cuenta}
                            onChange={handleChange}
                          />
                      </div>
                    )}
              </div>
              {/*Antecedentes Familiares*/}
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleSection("antecedentes_familiares")}>
                        Antecedentes Familiares
                      </button>
                      {activeSection === "antecedentes_familiares" && (
                        <div className="section-content">
                          <label>Contacto de emergencia</label>
                            <input 
                              type="text"
                              name="contacto_emergencia"
                              value={datos.contacto_emergencia}
                              onChange={handleChange} />
                          <label>Dirección de emergencia</label>
                            <input 
                              type="text"
                              name="direccion_emergencia" 
                              value={datos.direccion_emergencia}
                              onChange={handleChange}/>
                          <label>Telefono de emergencia</label>
                            <input 
                              type="text"
                              name="telefono_emergencia"
                              value={datos.telefono_emergencia}
                              onChange={handleChange} />
                          <label>N° de cargas familiares</label>
                            <input 
                              type="text"
                              name="num_hijos"
                              value={datos.num_hijos}
                              onChange={handleChange} />

                        </div>
                      )}
                    </div>

              {/*Terminos de contratacion */}
                    <div>
                      <button 
                        type="button"
                        onClick={() => toggleSection("terminos_contratacion")}>
                        Terminos de contratación
                      </button>
                    </div>
                    {activeSection === "terminos_contratacion" && (
                      <div className="section-content">
                        <label>Jornada</label>
                          <input 
                            type="text"
                            name="jornada"
                            value={datos.jornada}
                            onChange={handleChange} />
                        <label>Tipo de contrato</label>
                          <input 
                            type="text"
                            name="tipo_contrato"
                            value={datos.tipo_contrato}
                            onChange={handleChange}
                          />
                        <label>Instalación</label>
                          <input 
                            type="text"
                            name="instalacion"
                            value={datos.instalacion}
                            onChange={handleChange} />
                        <label>Ubicación</label>
                          <input 
                            type="text"
                            name="ubicacion"
                            value={datos.ubicacion}
                            onChange={handleChange} />
                        <label>Horario</label>
                          <input 
                            type="text"
                            name="horario"
                            value={datos.horario}
                            onChange={handleChange} />
                        <label>Sueldo</label>
                          <input 
                            type="text"
                            name="sueldo"
                            value={datos.sueldo}
                            onChange={handleChange} />
                        <label>Fecha de ingreso</label>
                          <input 
                            type="text"
                            name="fecha_ingreso"
                            value={datos.fecha_ingreso}
                            onChange={handleChange} />
                      </div>
                    )}

              {/*Vestuario */}
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleSection("vestuario")}>
                        Vestuario
                      </button>
                    </div>
                    {activeSection === "vestuario" && (
                      <div className="section-content">
                         <label>Camisa</label>
                          <input 
                            type="text"
                            name="camisa"
                            value={datos.camisa}
                            onChange={handleChange} />
                        <label>Parka</label>
                          <input 
                            type="text"
                            name="parka"
                            value={datos.jornada}
                            onChange={handleChange} />
                        <label>Polar</label>
                          <input 
                            type="text"
                            name="polar"
                            value={datos.polar}
                            onChange={handleChange} />
                         <label>pantalon</label>
                          <input 
                            type="text"
                            name="pantalon"
                            value={datos.pantalon}
                            onChange={handleChange} />
                          <label>Zapatos</label>
                          <input 
                            type="text"
                            name="zapatos"
                            value={datos.zapatos}
                            onChange={handleChange} />
                      </div>
                    )}

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
