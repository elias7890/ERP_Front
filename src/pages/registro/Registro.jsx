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
    const [isAdult, setIsAdult] = useState(true);
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [rutError, setRutError] = useState('');

    const validarRut = (rut) => {
      const cleanRut = rut.replace(/\./g, "").replace(/-/g, "");
      if (!/^\d{7,8}[0-9kK]$/.test(cleanRut)) return false;

      const body = cleanRut.slice(0, -1);
      let dv = cleanRut.slice(-1).toUpperCase();
      let sum = 0;
      let multipler = 2;

      for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multipler;
        multipler = multipler === 7 ? 2 : multipler + 1;
      }

      const caculatedDv = 11 - (sum % 11);
      const calculatedDv = caculatedDv === 11 ? "0" : caculatedDv === 10 ? "K" : caculatedDv.toString();

      return dv === calculatedDv;
    }


    const validateAge = (date) => {
      if (!date) return true; // Si no hay fecha, no mostrar error
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
  
      return (
        age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
      );
    };

    
  const validarCorreo = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Por favor, ingrese un correo electrónico válido.');
    } else {
      setEmailError('');
    }
  };

  const validarTelefono = (phone) => {
    const phoneRegex = /^(?:\+56)?\s?9\d{8}$/;
    if (!phoneRegex.test(phone)) {
        setPhoneError('Por favor, ingrese un número de celular válido (Ejemplo: +569XXXXXXXX o 9XXXXXXXX).');
      } else {
        setPhoneError('');
      }
  };

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value, }));

        const Validators = {
            email: validarCorreo,
            telefono: validarTelefono,
            telefono_emergencia: validarTelefono
        };

        if (value === "" || validarRut(value)) {
          setRutError(true);
        } else {
          setRutError(false);
        }

        if (name === "fecha_nacimiento") {
          const isOver18 = validateAge(value);
          setIsAdult(isOver18);
        }

        if( Validators[name]){
            Validators[name](value);
        }
        if (
            (name === "banco" && value === "Banco Estado" && formData.tipo_cuenta === "Cuenta Rut") ||
            (name === "tipo_cuenta" && value === "Cuenta Rut" && formData.banco === "Banco Estado")
          ) {
            
            const rutSinDigitoVerificador = formData.rut_funcionario.split('-')[0];
            setFormData((prev) => ({ ...prev, num_cuenta: rutSinDigitoVerificador }));
          }
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
                      <input
                        type="text"
                        name="rut_funcionario"
                        className={`input-small rut-input ${rutError ? "" : "rut-input-error"}`}
                        value={formData.rut_funcionario}
                        autoComplete="off"
                        placeholder={rutError ? "12345678-9" : "RUT inválido"}
                        onChange={handleChange}
                      />
                                                      
                    <label>Fecha de nacimiento:</label>
                      <div className="input-wrapper">
                        <input
                          type="date"
                          name="fecha_nacimiento"
                          className={`input-small ${isAdult ? "" : "date-input-error"}`}
                          value={formData.fecha_nacimiento}
                          onChange={handleChange}
                          placeholder={isAdult ? "" : "Debes ser mayor de 18 años"}
                        />
                      </div>
                    
                    <label>Estado Civil:</label>
                        <select  name="estado_civil"className="selct" value={formData.estado_civil} onChange={handleChange}>
                        <option value="" >Seleccionar</option>
                        <option value="casado" >Casado(a)</option>
                        <option value="soltero" >Soltero(a)</option>
                        <option value="conviviente" >Conviviente civil</option>
                        <option value="separado" >Separado(a)</option>
                        <option value="divorciado" >Divorciado(a)</option>
                        <option value="viudo" >Viudo(a)</option>
                        </select>
                    </div>
                    
                    &nbsp;
                    <div className="form-group">
                    <label>Domicilio:</label>
                    <input type="text" name="domicilio" className='input-small' value={formData.domicilio} onChange={handleChange}/>
                    
                    <label>Email:</label>
                    <div className="input-wrapper">
                    <input type="email" name="email" className="input-small" value={formData.email} onChange={handleChange}/>
                    <p className={`warning-message ${emailError ? 'visible' : ''}`}>{emailError}</p>
                    </div>
                    </div>
                    <div className="form-group">
                    <label>Estudios:</label>
                    <input type="text" name="estudios" className='input-small' value={formData.estudios} onChange={handleChange} />

                    <label>Nacionalidad:</label>
                    <input type="text" name="nacionalidad" className='input-small' value={formData.nacionalidad} onChange={handleChange}/>
        
                    <label>Teléfono:</label>
                    <div className="input-wrapper">
                    <input type="tel" name="telefono" className='input-small' value={formData.telefono} onChange={handleChange}/>
                    <p className={`warning-message ${phoneError ? 'visible' : ''}`}>{phoneError}</p>
                    </div>
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
                        <option value="PlanVital">AFP PlanVital</option>
                        <option value="ProVida">AFP ProVida</option>
                        <option value="Uno">AFP Uno</option>
                    </select>
                    <label>Salud:</label>
                    <select name="salud" className="selct" value={formData.salud} onChange={handleChange}>
                        <option value="">Seleccione</option>
                        <option value="Fonasa">Fonasa</option>
                        <option value="Isapre Colmena">Isapre Colmena</option>
                        <option value="Isapre Banmédica">Isapre Banmédica</option>
                        <option value="Isapre Consalud">Isapre Consalud</option>
                        <option value="Isapre Vida Tres">Isapre Vida Tres</option>
                        <option value="Isapre Cruz Blanca">Isapre Cruz Blanca</option>
                        <option value="Isapre Nueva Masvida">Isapre Nueva Masvida</option>
                    </select>   

                    <label>Alergico a:</label>
                    <select name="alergico" id="" className="selct" value={formData.alergico} onChange={handleChange}>
                        <option value="">Seleccione</option>
                        <option value="Ninguno">Sin Antecedentes</option>
                        <option value="Polvo">Polvo</option>
                        <option value="Animales">Animales</option>
                        <option value="Polen">Polen</option>
                        <option value="Alimentos">Alimentos</option>
                        <option value="Medicamentos">Medicamentos</option>
                        <option value="Otros">Otros</option>
                    </select>
                    </div>
                </section>
            )}

            
             {activeSection === "datosBancarios" && (
              <section className="form-section">
                <h3>Datos Bancarios</h3>
                <div className="form-group">
                <label>Banco:</label>
                    <select
                    name="banco"
                    className="selct"
                    value={formData.banco}
                    onChange={handleChange}
                    >
                    <option value="">Seleccione su banco</option>
                    <option value="Banco de Chile">Banco de Chile</option>
                    <option value="Banco Estado">Banco Estado</option>
                    <option value="Banco Santander">Banco Santander</option>
                    <option value="Banco BCI">Banco BCI</option>
                    <option value="Banco Itaú">Banco Itaú</option>
                    <option value="Scotiabank">Scotiabank</option>
                    <option value="Banco Falabella">Banco Falabella</option>
                    <option value="Banco Ripley">Banco Ripley</option>
                    <option value="Banco Consorcio">Banco Consorcio</option>
                    <option value="Banco Security">Banco Security</option>
                    <option value="Banco Internacional">Banco Internacional</option>
                    <option value="Banco BTG Pactual">Banco BTG Pactual</option>
                    <option value="Banco Desarrollo">Banco Desarrollo</option>
                    </select>


                <label>Tipo de cuenta:</label>
                  <select name="tipo_cuenta" id=""className='selct' value={formData.tipo_cuenta} onChange={handleChange}>
                    <option value=""> Seleccione</option>
                    <option >Cuenta Corriente</option>
                    <option >Cuenta Rut</option>
                    <option >Cuenta Vista</option>
                    <option >Cuenta de Ahorro</option>
                  </select>
      
                  <label>N° cuenta:</label>
                  <input type="text" name="num_cuenta" className='input-small' value={formData.num_cuenta} onChange={handleChange} />
      
                  
                  
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
                        <select name="jornada" id="" className="selct" value={formData.jornada} onChange={handleChange}>
                            <option value="">Seleccione</option>
                            <option value="Completa">Completa</option>
                            <option value="Parcial">Parcial</option>
                            <option value="Por Turnos">Por Turnos</option>
                            <option value="Flexible">Flexible</option>
                        </select>
                    </div>
                    
                    <div className="form-item">
                        <label>Tipo de contrato:</label>
                        <select name="tipo_contrato" id="" className="selct" value={formData.tipo_contrato} onChange={handleChange}>
                            <option value="">Seleccione</option>
                            <option value="Indefinido">Indefinido</option>
                            <option value="Plazo Fijo">Plazo Fijo</option>
                            <option value="Plazo Parcial">Parcial</option>
                            <option value="Por Obra o Faena">Por Obra o Faena</option>
                            <option value="Por Proyecto">Por Proyecto</option>
                            <option value="Por Temporada">Por Temporada</option>
                        </select>
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
                    {/* <div className="form-item">
  <label>Horario de trabajo:</label>
  <div className="time-input-wrapper">
    <input
      type="time"
      name="horarioInicio"
      className="input-time"
      value={formData.horarioInicio}
      onChange={(e) => setFormData({ ...formData, horarioInicio: e.target.value })}
    />
    <span>a</span>
    <input
      type="time"
      name="horarioFin"
      className="input-time"
      value={formData.horarioFin}
      onChange={(e) => setFormData({ ...formData, horarioFin: e.target.value })}
    />
  </div>
</div> */}

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