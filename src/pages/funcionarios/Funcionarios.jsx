import React, { useState } from "react";
import "./Funcionarios.scss";
import { buscarFuncionarioPorRut, descargarPDF} from "../../apis/indicador";
import ModalBuscarFuncionario from "../../Modales/ModalBuscarFun";


function Funcionarios(){
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
      sueldoBase: "",
      horasExtras: "",
      gratificacion: "",
      bonos: "",
      afpComision: "",
      salud: "7", 
    })
  
    const [resultados, setResultados] = useState({
      sueldoImponible: 0,
      descuentos: {
        afp: 0,
        salud: 0,
        cesantia: 0,
      },
      sueldoLiquido: 0,
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
    
      // Elimina cualquier carácter que no sea un número
      const numericValue = value.replace(/\D/g, ""); 
    
      if (/^\d*$/.test(numericValue)) { // Solo permite números enteros
        setFormValues({
          ...formValues,
          [name]: numericValue, // Almacena el valor puro
        });
      }
    };
    const formatCurrency = (number) => {
      if (!number) return ""; 
      const roundedNumber = Math.floor(number);
      return `$${roundedNumber.toLocaleString("es-CL")}`;
    };
        
   

    const calcularLiquidacion = (e) => {
      e.preventDefault();
    
      const sueldoBase = parseFloat(formValues.sueldoBase) || 0;
      const horasExtras = parseFloat(formValues.horasExtras) || 0;
      const gratificacion = parseFloat(formValues.gratificacion) || 0;
      const bonos = parseFloat(formValues.bonos) || 0;
      const afpComision = parseFloat(formValues.afpComision) || 0;
      const saludPorcentaje = parseFloat(formValues.salud) || 0;
    
      // Calcular el valor de la hora ordinaria
      const horasMensuales = 180; // Aproximado para jornadas de 45 horas semanales
      const valorHora = sueldoBase / horasMensuales;
    
      // Calcular el valor de las horas extras (50% más)
      const recargoHoraExtra = 1.5; // 50% adicional
      const pagoHorasExtras = horasExtras * valorHora * recargoHoraExtra;
    
      // Calcular el sueldo imponible
      const sueldoImponible = sueldoBase + pagoHorasExtras + gratificacion + bonos;
    
      // Descuentos legales
      const afp = sueldoImponible * (0.10 + afpComision / 100); 
      const salud = sueldoImponible * (saludPorcentaje / 100); 
      const cesantia = sueldoImponible * 0.006; 
      const totalDescuentos = afp + salud + cesantia;
    
      // Sueldo líquido
      const sueldoLiquido = sueldoImponible - totalDescuentos;
    
      // Guardar resultados
      setResultados({
        sueldoImponible,
        descuentos: { afp, salud, cesantia },
        sueldoLiquido,
        pagoHorasExtras, // Para mostrar el desglose de las horas extras si es necesario
      });
    };
    
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
           <div className="calculadora-liquidacion">
           <form onSubmit={calcularLiquidacion} className="formulario-calculo">
             <div>
               <label>Sueldo Base:</label>
               <input
                 type="text"
                 name="sueldoBase"
                 value={formatCurrency(formValues.sueldoBase)}
                 onChange={handleInputChange}
                 required
               />
             </div>
             <div>
               <label>Horas Extras:</label>
               <input
                 type="number"
                 name="horasExtras"
                 value={formValues.horasExtras}
                 onChange={handleInputChange}
               />
             </div>
             <div>
               <label>Gratificación:</label>
               <input
                 type="text"
                 name="gratificacion"
                 value={formatCurrency(formValues.gratificacion)}
                 onChange={handleInputChange}
               />
             </div>
             <div>
               <label>Bonos:</label>
               <input
                 type="text"
                 name="bonos"
                 value={formatCurrency(formValues.bonos)}
                 onChange={handleInputChange}
               />
             </div>
             <div>
               <label>Comisión AFP (%):</label>
               <input
                 type="number"
                 name="afpComision"
                 value={formValues.afpComision}
                 onChange={handleInputChange}
                 required
               />
             </div>
             <div>
               <label>Salud (%):</label>
               <select
                 name="salud"
                 value={formValues.salud}
                 onChange={handleInputChange}
               >
                 <option value="7">Fonasa (7%)</option>
                 <option value="10">Isapre (10%)</option>
               </select>
             </div>
             <button type="submit">Calcular</button>
           </form>
           
           {resultados.sueldoImponible > 0 && ( 
              <div className="resultados-calculo">
                <h2>Liquidación</h2>
                <div className="resultado-item">
                  <h3>Sueldo Imponible</h3>
                  <p>{formatCurrency(resultados.sueldoImponible)}</p> 
                </div>
                <div className="resultado-item">
                  <h3>Descuentos</h3>
                  <ul>
                    <li>AFP: {formatCurrency(resultados.descuentos.afp)}</li>
                    <li>Salud: {formatCurrency(resultados.descuentos.salud)}</li>
                    <li>Seguro de Cesantía: {formatCurrency(resultados.descuentos.cesantia)}</li>
                  </ul>
                </div>
                <div className="resultado-item">
                  <h3>Sueldo Líquido</h3>
                  <p><strong>{formatCurrency(resultados.sueldoLiquido)}</strong></p>
                </div>
                <button className="btn btn-save">Exportar a PDF</button>
              </div>
            )}

            
            <button className="btn-fijo" onClick={() => setIsModalOpen(true)}>
              Liquidaciones
            </button>
            <button className="btn-fijo1">Guardar</button>

              {isModalOpen && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h2>Liquidaciones del trabajador </h2>
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
                    <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            
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