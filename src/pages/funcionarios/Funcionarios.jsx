import React from "react";
import "./Funcionarios.scss";


function Funcionarios()  {


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
      <div className="profile-header">
        <div className="profile-picture">👤</div>
        <div className="profile-details">
          <h3>Francisca Bárbara Tapia Reyes</h3>
          <p>RUT: 20.183.653-7</p>
          <p>Dirección: Población Don Sebastián #139, Sagrada Familia</p>
        </div>
        <div className="form-buttons">    
          <button type="submit" className="btn btn-save">Exportar a PDF</button>
        </div>
      </div>
      <table className="table-layout">
        <tbody>
          {/* Información Personal */}
          <tr>
            <th>Fecha de nacimiento:&nbsp;21/06/1887</th>
            <th>Nacionalidad:&nbsp;Chilena</th>
          </tr>
          <tr>
            <th>Domicilio:&nbsp; por aqui</th>
            <th>N° de hijos:&nbsp;2</th>
          </tr>
          <tr>
            <th>Estado Civil:&nbsp;Casada</th>
            <th>Email:&nbsp;loquesea@gmail.com</th>
          </tr>
          <tr>
            <th>Teléfono:&nbsp;123456799</th>
            <th></th>
          </tr>
          <tr>
          <th>Discapacidad:&nbsp;No</th> 
          <th>Asiganación de pesión de inavalidez:&nbsp; Si/No</th>
          </tr>

          {/* Datos de Previsión y Salud */}
          <tr>
            <th>AFP:&nbsp;Provida</th>
            <th>Salud:&nbsp;Fonasa</th>
            
          </tr>

          {/* Información Bancaria */}
          <tr>
            <th>Banco:&nbsp;Banco Falabella</th>
            <th>N° Cuenta:&nbsp;[Número de cuenta]</th>
          </tr>
          <tr>
            <th>Tipo de cuenta:&nbsp;Cuenta corriente</th>
            <th></th>
          </tr>

          {/* Contacto de Emergencia */}
          <tr>
            <th>Contacto emergencia:&nbsp;987665412</th>
            <th>Dirección emergencia:&nbsp;calle falsa</th>
          </tr>
          <tr>
            <th>Teléfono emergencia:&nbsp;5631478</th>
            <th></th>
          </tr>
        </tbody>
      </table>
    </div>
  //Fin de seccion datos del funcionario//
  //Siguiente seccion de documentos//


  );

};

export default Funcionarios;