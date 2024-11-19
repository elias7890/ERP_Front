import React, { useState } from 'react';
import "./Funcionarios.scss";
import { Link, Outlet } from "react-router-dom";


function Formulario() {

    const [formData, setFormData] = useState({
      nombreCompleto: "",
      fechaNacimiento: "",
      estadoCivil: "",
      domicilio: "",
      cursoOs10:"",
      estudios:"",
      email: "",
      rut: "",
      nacionalidad: "",
      numHijos: "",
      telefono: "",
      afp: "",
      salud: "",
      banco: "",
      numCuenta: "",
      tipoCuenta: "",
      contactoEmergencia: "",
      direccionEmergencia: "",
      telefonoEmergencia: "",
      jornada: "",
      tcontrato: "",
      instalacion: "",
      ubicacion: "",
      horario: "",
      sueldo: "",
      fechaIng: "",
      camisa: "",
      parka: "",
      polar: "",
      pantalon: "",
      zapatos: "",
      alergico:"",
    });

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
      console.log("Datos a enviar:", formData);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/funcionarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          
        });

        if (response.ok) {
          alert("Datos guardados exitosamente");
          // Limpia el formulario si es necesario
          setFormData({
            nombreCompleto: "",
            fechaNacimiento: "",
            estadoCivil: "",
            domicilio: "",
            email: "",
            cursoOs10:"",
            rut: "",
            nacionalidad: "",
            numHijos: "",
            telefono: "",
            afp: "",
            salud: "",
            banco: "",
            numCuenta: "",
            estudios:"",
            tipoCuenta: "",
            contactoEmergencia: "",
            direccionEmergencia: "",
            telefonoEmergencia: "",
            jornada: "",
            tcontrato: "",
            instalacion: "",
            ubicacion: "",
            horario: "",
            sueldo: "",
            fechaIng: "",
            camisa: "",
            parka: "",
            polar: "",
            pantalon: "",
            zapatos: "",
            alergico:"",
          });
        } else {
          alert("Hubo un problema al guardar los datos");
        }
      } catch (error) {
        console.error("Error al enviar los datos:", error);
        alert("Error de conexión");
      }
    };

 
    return (
          <div className="formulario-container">
          
            <nav className="navFunc">
              <a href="/Funcionarios" className="tab active">Registro</a>
              <a href="/Datos" className="tab ">Datos</a>
              <a href="/documentos" className="tab">Documentos</a>
              <a href="/liquidaciones" className="tab">Liquidaciones</a>
              <a href="/lic-medicas" className="tab">Lic Médicas</a>
              <a href="/vacaciones" className="tab">Vacaciones</a>
              <a href="/historial" className="tab">Historial</a>
            </nav>
            
            {/* Formulario de antecedentes */}
            <form className="user-form" onSubmit={handleSubmit}>
              {/* Secciones del formulario... */}
      
              <section className="form-section">
                <h3>Antecedentes personales</h3>
                <div className="form-group">
                  <label>Nombre completo:</label>
                  <input type="text" name="nombreCompleto" className='input-small' value={formData.nombreCompleto} onChange={handleChange}/>

                  <label>Cédula de identidad:</label>
                  <input type="text" name="rut" className='input-small' value={formData.rut} onChange={handleChange}/>
      
                  <label>Fecha de nacimiento:</label>
                  <input type="date" name="fechaNacimiento" className='input-small' value={formData.fechaNacimiento} onChange={handleChange} />

                  <label>Estado Civil:</label>
                    <select  name="estadoCivil"className="selct" value={formData.estadoCivil} onChange={handleChange}>
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
      
              {/* Resto de secciones */}
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
      
              <section className="form-section">
                <h3>Datos Bancarios</h3>
                <div className="form-group">
                  <label>Banco:</label>
                  <input type="text" name="banco" className='input-small' value={formData.banco} onChange={handleChange}/>
      
                  <label>N° cuenta:</label>
                  <input type="text" name="numCuenta" className='input-small' value={formData.numCuenta} onChange={handleChange} />
      
                  <label>Tipo de cuenta:</label>
                  <select name="tipoCuenta" id=""className='selct' value={formData.tipoCuenta} onChange={handleChange}>
                    <option value=""> Seleccione</option>
                    <option value="CuentaC">Cuenta Corriente</option>
                    <option value="CuentaV">Cuenta Vista</option>
                    
                  </select>
                  
                </div>
              </section>
      
              <section className="form-section">
                <h3>Antecedentes familiares</h3>
                <div className="form-group">
                  <label>Persona contacto de emergencia:</label>
                  <input type="text" name="contactoEmergencia" className='input-small' value={formData.contactoEmergencia} onChange={handleChange}/>
      
                  <label>Dirección:</label>
                  <input type="text" name="direccionEmergencia" className='input-small' value={formData.direccionEmergencia} onChange={handleChange}/>
      
                  <label>Teléfono:</label>
                  <input type="tel" name="telefonoEmergencia" className='input-small' value={formData.telefonoEmergencia} onChange={handleChange}/>

                  <label>N° de cargas familiares:</label>
                  <input type="number" name="numHijos" className='input-small' value={formData.numHijos} onChange={handleChange}/>
                </div>
              </section>

              <section className="form-section terminos-section">
                <h3>Términos de contratación</h3>
                <div className="form-group">
                    <div className="form-item">
                        <label>Jornada de trabajo:</label>
                        <input type="text" name="jornada" className="input-small" value={formData.jornada} onChange={handleChange}/>
                    </div>
                    
                    <div className="form-item">
                        <label>Tipo de contrato:</label>
                        <input type="text" name="tcontrato" className="input-small" value={formData.tcontrato} onChange={handleChange}/>
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
                        <input type="date" name="fechaIng" className="input-small" value={formData.fechaIng} onChange={handleChange}/>
                    </div>
                     <div>
                     <label>Vigencia Curso OS-10:</label>
                     <input type="date" name="cursoOs10" className='input-small' value={formData.cursoOs10} onChange={handleChange} />
                     </div>
                    
                </div>
            </section>


            <section className="form-section terminos-section">
                <h3>Vestuario</h3>
                <div className="form-group">

                    <div className="form-item">
                        <label>Camisa</label>
                        <select name="camisa" id="" className="selct" value={formData.camisa} onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option value="cs">Talla S</option>
                            <option value="cM">Talla M</option>
                            <option value="cL">Talla L</option>
                            <option value="cXL">Talla XL</option>
                        </select>
                    </div>

                    <div className="form-item">
                        <label>Parka</label>
                        <select name="parka" id="" className="selct" value={formData.parka} onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option value="ps">Talla S</option>
                            <option value="pM">Talla M</option>
                            <option value="pL">Talla L</option>
                            <option value="pXL">Talla XL</option>
                        </select>
                    </div>

                    <div className="form-item">
                        <label>Polar</label>
                        <select name="polar" id="" className="selct" value={formData.polar} onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option value="pos">Talla S</option>
                            <option value="poM">Talla M</option>
                            <option value="poL">Talla L</option>
                            <option value="poXL">Talla XL</option>
                        </select>
                    </div>

                    <div className="form-item">
                        <label>Pantalon</label>
                        <select name="pantalon" id="" className="selct" value={formData.pantalon} onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option value="pas">Talla S</option>
                            <option value="paM">Talla M</option>
                            <option value="paL">Talla L</option>
                            <option value="paXL">Talla XL</option>
                        </select>
                    </div>

                    <div className="form-item">
                        <label>Zapatos</label>
                        <input type="text" name="zapatos" className="input-small" value={formData.zapatos} onChange={handleChange}/>
                    </div>

                </div>

            </section>

      
              {/* Botones de acción */}
              <div className="form-buttons">
                <button type="button" className="btn btn-edit">Modificar</button>
                <button type="submit" className="btn btn-save">Guardar</button>
              </div>
            </form>
          </div>
        
    );
  };

  
  export default Formulario;