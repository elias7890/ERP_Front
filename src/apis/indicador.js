import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000/api";


export const buscarFuncionarioPorRut = async (rut) => {
    try {
      const response = await fetch(`${BASE_URL}/BusquedaFuncionario/${rut}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Funcionario no encontrado`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error al buscar funcionario:", error.message);
      throw error;
    }
  };

  export const buscarLiquidacionesPorRut = async (rut) => {
    try {
      const response = await axios.get(`${BASE_URL}/liquidaciones/${rut}`);
      return response.data; 
    } catch (error) {
      console.error("Error al buscar liquidaciones:", error.message);
      throw error;
    }
  };


  export const descargarPDF = async (rut) => {
    try {
      const response = await fetch(`${BASE_URL}/funcionarios/${rut}/pdf`, {
        method: "GET",
        headers: { 
        },
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: PDF no encontrado`);
      }
      const pdfBlob = await response.blob(); 
      return pdfBlob;
    } catch (error) {
      console.error("Error al descargar el PDF:", error.message);
      throw error;
    }
  };

  export const descargarLiquidacionPDF = async (rut, fecha_liquidacion) => {
    try {
      const response = await fetch(`${BASE_URL}/liquidaciones/pdf/${rut}/${fecha_liquidacion}`, {
        method: "GET",
        headers:{ 
        },
      });
      if (!response.ok){
        throw new Error(`Error ${response.status}: PDF no encontrado`);
      }
      const pdfBlob = await response.blob();
      return pdfBlob; 
    } catch (error) {
      console.error("error al descargar la liquidacion:", error.message);
      throw error;
      
    }
  }



    export const cargarFuncionario = async (formData) => {
        const formattedData = formatData(formData);
        try {
        const response = await fetch("http://127.0.0.1:8000/api/funcionarios", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedData),
        });
    
        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData.message || "Error desconocido" };
        }
        } catch (error) {
        console.error("Error al enviar los datos:", error);
        return { success: false, message: "Error de conexión" };
        }
    };
    
    const formatData = (data) => {
        const formattedData = { ...data };
    
        if (formattedData.fecha_nacimiento) {
            const fechaNacimiento = new Date(formattedData.fecha_nacimiento);
            formattedData.fecha_nacimiento = fechaNacimiento.toISOString().split('T')[0]; 
        }
    
        if (formattedData.fecha_ingreso) {
            const fechaIngreso = new Date(formattedData.fecha_ingreso);
            formattedData.fecha_ingreso = fechaIngreso.toISOString().split('T')[0]; 
        }
    
        if (formattedData.sueldo) {
            formattedData.sueldo = parseFloat(formattedData.sueldo.replace(/[^\d.-]/g, '')); 
        }
    
        return formattedData;
    };
    

    const parseLiquidacionData = (data) => {
      return {
        rut_funcionario: String(data.rut_funcionario).trim(),
        nombre_empleado: String(data.nombre_empleado).trim(),
        obra: String(data.obra).trim(),
        sueldo_base: Number(data.sueldo_base),
        gratificacion: Number(data.gratificacion),
        asignacion_movilizacion: Number(data.asignacion_movilizacion),
        asignacion_colacion: Number(data.asignacion_colacion),
        afp: parseFloat(data.afp),
        salud: parseFloat(data.salud),
        seguro_cesantia: parseFloat(data.seguro_cesantia),
        impuesto: Number(data.impuesto),
        rebaja: Number(data.rebaja),
        anticipo_sueldo: Number(data.anticipo_sueldo),
        otros_descuentos: Number(data.otros_descuentos),
        fecha_liquidacion: String(data.fecha_liquidacion),
      };
    };
    
    export const createLiquidacion = async (data) => {
      const parsedData = parseLiquidacionData(data); 
      try {
        const response = await fetch(`${BASE_URL}/liquidaciones`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(parsedData),
        });
        if (!response.ok) {
          const errorData = await response.text();  
          try {
            const parsedErrorData = JSON.parse(errorData);  
            throw new Error(parsedErrorData.message || 'Error en la API');
          } catch (e) {
            throw new Error('Error en la API: ' + errorData);  
          }
        }
        const contentType = response.headers.get('Content-Type');
        let result;
        if (contentType && contentType.includes('application/json')) {
          result = await response.json();  
        } else {
          result = await response.text();  
        }
        return result;
      } catch (error) {
        console.error('Error en createLiquidacion:', error);
        throw error;
      }
    };


    