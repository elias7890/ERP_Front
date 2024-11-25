import React, { useState } from "react";
import "./Funcionarios.scss";
import { buscarFuncionarioPorRut, descargarPDF} from "../../apis/indicador";
import ModalBuscarFuncionario from "../../Modales/ModalBuscarFun";


function Funcionarios()  {
  const [currentSection, setCurrentSection] = useState("datos");
  const [modalOpen, setModalOpen] = useState(false);
  const [funcionario, setfuncionario] = useState(null);
  const [rut, setRut] = useState("");
  const [rutBuscado, setRutBuscado] = useState("");
  const handleAbrirModal = () => setModalOpen(true);
  const handleCerrarModal = () => {
    setModalOpen(false);
    setFuncionario(null); 
    setRutBuscado(""); 
  };
 

  // const handleBuscarFuncionario = async () => {
  //   try {
  //     const data = await buscarFuncionarioPorRut(rut);
  //     setfuncionario(data);
  //     setRutBuscado(rut);
  //   } catch (error) {
  //     setFuncionario(null);
  //   }
  // };

  const handleBuscarFuncionario = async (rut) => {
    try {
      const data = await buscarFuncionarioPorRut(rut); // Tu método para buscar por RUT
      setfuncionario(data);
      setRutBuscado(rut);
      setModalOpen(true); // Abre el modal una vez que los datos se han cargado
    } catch (error) {
      setFuncionario(null);
      console.error("No se pudo encontrar al funcionario", error);
    }
  };

 

  const handleDescargarPDF = async () => {
    if (!rutBuscado) {
      console.error("No se ha realizado una búsqueda para descargar el PDF.");
      return;
    }
  
    try {
      const pdfBlob = await descargarPDF(rutBuscado); 
      const url = window.URL.createObjectURL(pdfBlob); 
      const a = document.createElement("a");
      a.href = url; 
      a.download = `Funcionario_${rutBuscado}.pdf`; 
      document.body.appendChild(a); 
      a.click(); 
      a.remove(); 
      console.log("PDF descargado exitosamente.");
    } catch (error) {
      console.error("Error al descargar el PDF:", error.message);
    }
  };
  
  return (
    <div className="containerFun">
      <nav className="navbarFun">
        {/* <button className="active">Datos</button> */}
        <button className={currentSection === "datos" ? "active" : ""} onClick={() => setCurrentSection("datos")}>
          Datos
        </button>
        <button className={currentSection === "Documentos" ? "active" : ""} onClick={() => setCurrentSection("Documentos") }>
          Documentos
        </button>
        <button className={currentSection === "Liquidaciones" ? "active" : ""} onClick={() => setCurrentSection("Liquidaciones") }>
          Liquidaciones
        </button>
        <button className={currentSection === "Lic_Medicas" ? "active" : ""} onClick={() => setCurrentSection("Lic_Medicas") }>
          Lic Médicas
        </button>
        <button className={currentSection === "Vacaciones" ? "active" : ""} onClick={() => setCurrentSection("Vacaciones") }>
          Vacaciones
        </button>
        <button className={currentSection === "Historial" ? "active" : ""} onClick={() => setCurrentSection("Historial") }>
          Historial
        </button>
      </nav>

      {currentSection === "datos" && (
        <div>
          <div className="search-container">
            <input
              type="text"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              placeholder="Ingresa el RUT"
            />
            <button onClick={handleBuscarFuncionario}>Buscar Funcionario</button>
          </div>
          <div className="profile-header">
            <div className="profile-picture">👤</div>
            <div className="profile-details">
              {funcionario ? (
                <>
                  <h3>{funcionario.nombre_completo}</h3>
                  <p>RUT: {funcionario.rut_funcionario}</p>
                  <p>Dirección: {funcionario.domicilio}</p>
                </>
              ) : (
                <p>No hay datos del funcionario. Realice una búsqueda.</p>
              )}
            </div>
            <div className="form-buttons">
              <button
                onClick={handleDescargarPDF}
                className="btn btn-save"
              >
                Exportar a PDF
              </button>
              <button
                className="btn btn-save"
                onClick={handleAbrirModal}
              >
                Modificar
              </button>
              {modalOpen && (
                <ModalBuscarModificar
                  isOpen={modalOpen}
                  onClose={handleCerrarModal}
                  funcionario={funcionario}
                  rut={rutBuscado}
                  onGuardar={(datosActualizados) => {
                    console.log("Datos guardados:", datosActualizados);
                    handleCerrarModal();
                  }}
                />
              )}
            </div>
          </div>
          <div>
            {funcionario ? (
              <table className="table-layout">
                <tbody>
                  <tr>
                    <th><strong>Informacion personal</strong></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>Fecha de nacimiento:&nbsp;{funcionario.fecha_nacimiento}</th>
                    <th>Nacionalidad:&nbsp;{funcionario.nacionalidad}</th>
                  </tr>
                  <tr>
                    <th>Domicilio:&nbsp;{funcionario.domicilio}</th>
                    <th>N° de hijos:&nbsp;{funcionario.num_hijos}</th>
                  </tr>
                  <tr>
                    <th>Estado Civil:&nbsp;{funcionario.estado_civil}</th>
                    <th>Email:&nbsp;{funcionario.email}</th>
                  </tr>
                  <tr>
                    <th>Teléfono:&nbsp;{funcionario.telefono}</th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>Discapacidad:&nbsp;Si</th>
                    <th>Asiganación de pesión de invalidez:&nbsp;Si/No</th>
                  </tr>
                  <tr>
                    <th><strong>Datos de Previsión y Salud</strong></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>AFP:&nbsp;{funcionario.afp}</th>
                    <th>Salud:&nbsp;{funcionario.salud}</th>
                  </tr>
                  <tr>
                    <th><strong>Información Bancaria</strong></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>Banco:&nbsp;{funcionario.banco}</th>
                    <th>N° Cuenta:&nbsp;{funcionario.num_cuenta}</th>
                  </tr>
                  <tr>
                    <th>Tipo de cuenta:&nbsp;{funcionario.tipo_cuenta}</th>
                    <th></th>
                  </tr>
                  <tr>
                    <th><strong>Contacto de Emergencia</strong></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>Contacto emergencia:&nbsp;{funcionario.contacto_emergencia}</th>
                    <th>Dirección emergencia:&nbsp;{funcionario.direccion_emergencia}</th>
                  </tr>
                  <tr>
                    <th>Teléfono emergencia:&nbsp;{funcionario.telefono_emergencia}</th>
                    <th></th>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>No hay datos del funcionario. Realice una búsqueda.</p>
            )}
          </div>
        </div>
      )}
      {/*******************************SECCION DOCUMENTOS*****************************************************************************************/}

      {currentSection === "Documentos" && (
        <div>
          <h2>Documentos</h2>
          <p>Aquí puedes gestionar los documentos del funcionario.</p>
          {/* Agrega el contenido específico de la sección de Documentos aquí */}
        </div>
      )}

       {/*******************************SECCION LIQUIDACIONES*****************************************************************************************/}
  
        {currentSection === "Liquidaciones" && (
          <div>
            <table border="1" className="encabezados">
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Monto Imponible</th>
                  <th>Total Haberes</th>
                  <th>Total Descuento</th>
                  <th>Visualizar</th>
                  <th>Comprobante de Pago</th>
                </tr>
              </thead>
            </table> 
         </div>
         )}
        
       {/*******************************SECCION LICENCIAS*****************************************************************************************/}


      {currentSection === "Lic_Medicas" && (
        <div>
          <h2>Licencias Médicas</h2>
          <p>Aquí puedes gestionar las licencias médicas del funcionario.</p>
        </div>
      )}

       {/*******************************SECCION VACACIONES*****************************************************************************************/}


      {currentSection === "Vacaciones" && (
        <div>
          <h2>Vacaciones</h2>
          <p>Aquí puedes gestionar las vacaciones del funcionario.</p>
        </div>
      )}

       {/*******************************SECCION HISTORIAL*****************************************************************************************/}


      {currentSection === "Historial" && (
        <div>
          <h2>Historial</h2>
          <p>Aquí puedes consultar el historial del funcionario.</p>
        </div>
      )}
    </div>
  );

};

export default Funcionarios;