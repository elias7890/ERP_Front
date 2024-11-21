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
    