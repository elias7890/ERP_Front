import React, { useState } from 'react';
import "./Registro.scss";
import { Link, Outlet } from "react-router-dom";
import { cargarFuncionario } from '../../apis/indicador';


function Registro() {

    const [activeSection, setActiveSection] = useState("antecedentesPersonales");
    

    const [formData, setFormData] = useState({
      nombre_completo: "",
      fecha_nacimiento: "",
      estado_civil: "",
      domicilio: "",
      cursoos10:"",
      estudios:"",
      email: "",
      rut_funcionario: "",
      nacionalidad: "",
      num_hijos: "",
      telefono: "",
      afp: "",
      salud: "",
      banco: "",
      num_cuenta: "",
      tipo_cuenta: "",
      contacto_emergencia: "",
      direccion_emergencia: "",
      telefono_emergencia: "",
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
      alergico:"",
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
      e.preventDefault();     
      const result = await cargarFuncionario(formData);
  
      if (result.success) {
        setSuccess(true);
        setError(null);
        alert("Datos guardados exitosamente");
        
        setFormData({
          nombre_completo: "",
          fecha_nacimiento: "",
          estado_civil: "",
          domicilio: "",
          email: "",
          cursoos10: "",
          rut_funcionario: "",
          nacionalidad: "",
          num_hijos: "",
          telefono: "",
          afp: "",
          salud: "",
          banco: "",
          num_cuenta: "",
          estudios: "",
          tipo_cuenta: "",
          contacto_emergencia: "",
          direccion_emergencia: "",
          telefono_emergencia: "",
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
          alergico: "",
        });
      } else {
        setError(result.message || "Hubo un error al guardar los datos");
        setSuccess(false);
      }
    };

 
    return (
          <div className="formulario-container">
          
          <nav className="navFunc">
                <a 
                    onClick={() => setActiveSection("antecedentesPersonales")} 
                    className={`tab ${activeSection === "antecedentesPersonales" ? "active" : ""}`}
                >
                Antecedentes Personales
                </a>
                <a 
                    onClick={() => setActiveSection("previsionSocial")} 
                    className={`tab ${activeSection === "previsionSocial" ? "active" : ""}`}
                >
                Previsión Social
                </a>
                <a 
                    onClick={() => setActiveSection("datosBancarios")} 
                    className={`tab ${activeSection === "datosBancarios" ? "active" : ""}`}
                >
                Datos Bancarios
                </a>
                <a 
                    onClick={() => setActiveSection("antecedentesFamiliares")} 
                    className={`tab ${activeSection === "antecedentesFamiliares" ? "active" : ""}`}
                >
                Antecedentes Familiares
                </a>
                <a 
                    onClick={() => setActiveSection("terminosContratacion")} 
                    className={`tab ${activeSection === "terminosContratacion" ? "active" : ""}`}
                >
                Términos de Contratación
                </a>
                <a 
                    onClick={() => setActiveSection("vestuario")} 
                    className={`tab ${activeSection === "vestuario" ? "active" : ""}`}
                >
                Vestuario
                </a>
         </nav>

            
            <form className="user-form" onSubmit={handleSubmit}>
              {/* Secciones del formulario... */}
        {activeSection === "antecedentesPersonales" && (
            <section className="form-section">
                <h3>Antecedentes personales</h3>
                    <div className="form-group">
                    <label>Nombre completo:</label>
                    <input type="text" name="nombre_completo" className='input-small' value={formData.nombre_completo} onChange={handleChange}/>

                    <label>Cédula de identidad:</label>
                    <input type="text" name="rut_funcionario" className='input-small' value={formData.rut_funcionario} onChange={handleChange}/>
        
                    <label>Fecha de nacimiento:</label>
                    <input type="date" name="fecha_nacimiento" className='input-small' value={formData.fecha_nacimiento} onChange={handleChange} />

                    <label>Estado Civil:</label>
                        <select  name="estado_civil"className="selct" value={formData.estado_civil} onChange={handleChange}>
                        <option value="" >Seleccionar</option>
                        <option value="casado" >Casado</option>
                        <option value="soltero" >Soltero</option>
                        </select>
                    </div>
      
                    <div className="form-group">
                    <label>Domicilio:</label>
                    <input type="text" name="domicilio" className='input-small' value={formData.domicilio} onChange={handleChange}/>
        
                    <label>Email:</label>
                    <input type="email" name="email" className='input-small' value={formData.email} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                    <label>Estudios:</label>
                    <input type="text" name="estudios" className='input-small' value={formData.estudios} onChange={handleChange} />

                    <label>Nacionalidad:</label>
                    <input type="text" name="nacionalidad" className='input-small' value={formData.nacionalidad} onChange={handleChange}/>
        
                    <label>Teléfono:</label>
                    <input type="tel" name="telefono" className='input-small' value={formData.telefono} onChange={handleChange}/>
                    </div>
            </section>
        )}
            
            {activeSection === "previsionSocial" && (
                <section className="form-section">
                    <h3>Previsión Social</h3>
                    <div className="form-group">
                    <label>AFP:</label>
                    <select name="afp" id="" className="selct" value={formData.afp} onChange={handleChange}>
                        <option value="" >Seleccione</option>
                        <option value="Capital">AFP Capital</option>
                        <option value="Cuprum">AFP Cuprum</option>
                        <option value="Habitat">AFP Habitat</option>
                        <option value="Modelo">AFP Modelo</option>
                        <option value="PlanV">AFP PlanVital</option>
                        <option value="ProV">AFP ProVida</option>
                        <option value="Uno">AFP Uno</option>
                    </select>
                    <label>Salud:</label>
                    <select name="salud" className="selct" value={formData.salud} onChange={handleChange}>
                        <option value="">Seleccione</option>
                        <option value="Fonasa">Fonasa</option>
                        <option value="Isapre">Isapre</option>
                    </select>   

                    <label>Alergico a:</label>
                    <input type="text" name="alergico" className='input-small' value={formData.alergico} onChange={handleChange} />
                    </div>
                </section>
            )}

            
             {activeSection === "datosBancarios" && (
              <section className="form-section">
                <h3>Datos Bancarios</h3>
                <div className="form-group">
                  <label>Banco:</label>
                  <input type="text" name="banco" className='input-small' value={formData.banco} onChange={handleChange}/>
      
                  <label>N° cuenta:</label>
                  <input type="text" name="num_cuenta" className='input-small' value={formData.num_cuenta} onChange={handleChange} />
      
                  <label>Tipo de cuenta:</label>
                  <select name="tipo_cuenta" id=""className='selct' value={formData.tipo_cuenta} onChange={handleChange}>
                    <option value=""> Seleccione</option>
                    <option >Cuenta Corriente</option>
                    <option >Cuenta Vista</option>
                    
                  </select>
                  
                </div>
              </section>
              )}

             {activeSection === "antecedentesFamiliares" && (
              <section className="form-section">
                <h3>Antecedentes familiares</h3>
                <div className="form-group">
                  <label>Persona contacto de emergencia:</label>
                  <input type="text" name="contacto_emergencia" className='input-small' value={formData.contacto_emergencia} onChange={handleChange}/>
      
                  <label>Dirección:</label>
                  <input type="text" name="direccion_emergencia" className='input-small' value={formData.direccion_emergencia} onChange={handleChange}/>
      
                  <label>Teléfono:</label>
                  <input type="tel" name="telefono_emergencia" className='input-small' value={formData.telefono_emergencia} onChange={handleChange}/>

                  <label>N° de cargas familiares:</label>
                  <input type="number" name="num_hijos" className='input-small' value={formData.num_hijos} onChange={handleChange}/>
                </div>
              </section>
              )}

             {activeSection === "terminosContratacion" && (
              <section className="form-section terminos-section">
                <h3>Términos de contratación</h3>
                <div className="form-group">
                    <div className="form-item">
                        <label>Jornada de trabajo:</label>
                        <input type="text" name="jornada" className="input-small" value={formData.jornada} onChange={handleChange}/>
                    </div>
                    
                    <div className="form-item">
                        <label>Tipo de contrato:</label>
                        <input type="text" name="tipo_contrato" className="input-small" value={formData.tipo_contrato} onChange={handleChange}/>
                    </div>

                    <div className="form-item">
                        <label>Instalación:</label>
                        <input type="text" name="instalacion" className="input-small" value={formData.instalacion} onChange={handleChange}/>
                    </div>

                    <div className="form-item">
                        <label>Ubicación:</label>
                        <input type="text" name="ubicacion" className="input-small" value={formData.ubicacion} onChange={handleChange}/>
                    </div>

                    <div className="form-item">
                        <label>Horario de trabajo:</label>
                        <input type="text" name="horario" className="input-small" value={formData.horario} onChange={handleChange}/>
                    </div>

                    <div className="form-item">
                        <label>Sueldo:</label>
                        <input type="text" name="sueldo" className="input-small" value={formData.sueldo} onChange={handleChange}/>
                    </div>

                    <div className="form-item">
                        <label>Fecha de ingreso:</label>
                        <input type="date" name="fecha_ingreso" className="input-small" value={formData.fecha_ingreso} onChange={handleChange}/>
                    </div>
                     <div>
                     <label>Vigencia Curso OS-10:</label>
                     <input type="date" name="cursoos10" className='input-small' value={formData.cursoos10} onChange={handleChange} />
                     </div>
                    
                </div>
               </section>
               )}

             {activeSection === "vestuario" && (
             <section className="form-section terminos-section">
                <h3>Vestuario</h3>
                <div className="form-group">

                    <div className="form-item">
                        <label>Camisa</label>
                        <select name="camisa" id="" className="selct" value={formData.camisa} onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option >Talla S</option>
                            <option >Talla M</option>
                            <option>Talla L</option>
                            <option >Talla XL</option>
                        </select>
                    </div>

                    <div className="form-item">
                        <label>Parka</label>
                        <select name="parka" id="" className="selct" value={formData.parka} onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option >Talla S</option>
                            <option >Talla M</option>
                            <option >Talla L</option>
                            <option >Talla XL</option>
                        </select>
                    </div>

                    <div className="form-item">
                        <label>Polar</label>
                        <select name="polar" id="" className="selct" value={formData.polar} onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option >Talla S</option>
                            <option >Talla M</option>
                            <option >Talla L</option>
                            <option >Talla XL</option>
                        </select>
                    </div>

                    <div className="form-item">
                        <label>Pantalon</label>
                        <select name="pantalon" id="" className="selct" value={formData.pantalon} onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option >Talla S</option>
                            <option >Talla M</option>
                            <option >Talla L</option>
                            <option >Talla XL</option>
                        </select>
                    </div>

                    <div className="form-item">
                        <label>Zapatos</label>
                        <input type="text" name="zapatos" className="input-small" value={formData.zapatos} onChange={handleChange}/>
                    </div>

                </div>
                &nbsp;
                &nbsp;
                <div className="form-buttons">
                {error && <div className="error">{error}</div>}
                {success && <div className="success">Funcionario guardado correctamente</div>}
                <button type="button" className="btn btn-edit">Modificar</button>
                <button type="submit" className="btn btn-save">Guardar</button>
              </div>
              </section>
              )}
              </form>
              </div>
        
    );
  };

  
  export default Registro;