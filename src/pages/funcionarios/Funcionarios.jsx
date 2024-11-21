import React, { useState } from "react";
import "./Funcionarios.scss";
import { buscarFuncionarioPorRut, descargarPDF} from "../../apis/indicador";


function Funcionarios()  {

  const [funcionario, setfuncionario] = useState(null);
  const [rut, setRut] = useState("");
  const [rutBuscado, setRutBuscado] = useState("");

  const handleBuscarFuncionario = async () => {
    try {
      const data = await buscarFuncionarioPorRut(rut);
      setfuncionario(data);
      setRutBuscado(rut);
    } catch (error) {
      setFuncionario(null);
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
        <button className="active">Datos</button>
        <button>Documentos</button>
        <button>Liquidaciones</button>
        <button>Lic Médicas</button>
        <button>Vacaciones</button>
        <button>Historial</button>
      </nav>
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
          <button onClick={handleDescargarPDF} className="btn btn-save">Exportar a PDF</button>
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
          {/* Información Personal */}
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
          <th>Asiganación de pesión de inavalidez:&nbsp; Si/No</th>
          </tr>
           <tr>
             <th><strong>Datos de Previsión y Salud</strong></th>
             <th></th>
           </tr>
          {/* Datos de Previsión y Salud */}
          <tr>
            <th>AFP:&nbsp;{funcionario.afp}</th>
            <th>Salud:&nbsp;{funcionario.salud}</th>
            
          </tr>
          <tr>
            <th><strong>Información Bancaria</strong></th>
            <th></th>
          </tr>
          {/* Información Bancaria */}
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
          {/* Contacto de Emergencia */}
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
  //Fin de seccion datos del funcionario//
  //Siguiente seccion de documentos//


  );

};

export default Funcionarios;