import React, { useState, useEffect } from "react";
import axios from "axios";
import "./IndicadoresFinan.scss";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, IconButton, Typography, Box, Dialog,             // Importación del Dialog
  DialogActions,       
  DialogContent,       
  DialogTitle,         
  } from "@mui/material";
import { Add } from "@mui/icons-material";



function IndicadoresFinan() {
  const [afpData, setAfpData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const [currentSection, setCurrentSection] = useState("AFP");
  const [indicatorsData, setIndicatorsData] = useState([]);
  const [error, setError] = useState(null);
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const [ufValue, setUfValue] = useState(null);
  const [rentasData, setRentasData] = useState([
    { Concepto: "Para afiliados a una AFP", UF: "84.3 UF", monto: "" },
    { Concepto: "Para afiliados al INP", UF: "60 UF", monto: "" },
    { Concepto: "Para afiliados al INP", UF: "126.6 UF", monto: "" },
  ]);


  //trae las afp una de cada una y la fecha más actualizada de esta
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/afps")
      .then((response) => {
        console.log("Datos obtenidos:", response.data);
        // Asegurarte de que los datos sean un arreglo
        setAfpData(Array.isArray(response.data.data) ? response.data.data : []);
      })
      .catch((error) => {
        console.error("Hubo un error al cargar los datos:", error);
      });
  }, []);

  

  //trae los indicadores uf,utm y ivp
   useEffect(() => {
     axios.get("https://mindicador.cl/api")
       .then((response) => {
         const { uf, utm, ivp } = response.data;
         setUfValue(uf.valor);
         const date = new Date();
         const month = date.toLocaleString('default', { month: 'long' }); 
         const year = date.getFullYear();

         const formattedData = [
          {
             mes: `${month} ${year}`,
             uf: uf.valor,
             utm: utm.valor,
             uta: ivp.valor, // Puedes cambiar IVP por UTA si tienes otra fuente
           },
         ];
         setIndicatorsData(formattedData);
         setLoadingIndicators(false);
       })
       .catch((error) => {
         console.error("Error al obtener los indicadores:", error);
         setError("Hubo un error al obtener los indicadores.");
         setLoadingIndicators(false);
      });
   }, []);

   useEffect(() => {
    // Obtener el valor de la UF desde la API para rentas imponibles
    axios.get("https://mindicador.cl/api")
      .then((response) => {
        const ufValue = response.data.uf.valor; // Capturar el valor de la UF
        setUfValue(ufValue);

        // Actualizar el arreglo rentasData con los valores calculados
        const updatedRentasData = rentasData.map((item) => {
          const ufNumber = parseFloat(item.UF); // Extraer el número de UF
          const montoCalculado = ufNumber * ufValue; // Calcular el monto
          const montoFormateado = new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
          }).format(montoCalculado); // Formatear como moneda CLP

          return { ...item, monto: montoFormateado }; // Actualizar el monto formateado
        });

        setRentasData(updatedRentasData); // Actualizar el estado con los datos nuevos
      })
      .catch((error) => {
        console.error("Error al obtener el valor de la UF:", error);
      });
  }, []);

  
  
  const addAfpRow = () => {
    setAfpData([...afpData, newAfp]);
    setNewAfp({ afp: "", tasa_afp: "", sis: "", tasa_afp_ind: "" });
    setOpenModal(false);
  };

  const [newAfp, setNewAfp] = useState({
    afp: "",
    tasa_afp: "",
    sis: "",
    tasa_afp_ind: "",
  });

  const filledAfpData = [...afpData];
  while (filledAfpData.length < 7) {
    filledAfpData.push({ afp: "", tasa_afp: "", sis: "", tasa_afp_ind: "" });
  }
 
  //Rentas minimas imponibles 
  const rentasMinimasData = [
    { Concepto: "Trab. Dependientes e Independientes", Monto: "$500.000" },
    { Concepto: "Menores de 18 y Mayores de 65", Monto: "$372.989" },
    { Concepto: "Trabajadores de Casa Particular", Monto: "$500.000" },
    { Concepto: "Para fines no remuneracionales", Monto: "$322.295" },
  ];

  // Actualizar los valores de una fila
  const handleInputChange = (e, index, field) => {
    const updatedData = [...afpData];
    updatedData[index][field] = e.target.value;
    setAfpData(updatedData);
  };
  const handleAddRow = () => {
    const newRow = { afp: "", tasa_afp: "", sis: "", tasa_afp_ind: "" };
    setAfpData([...afpData, newRow]); // Esto sigue funcionando igual
  };

  const saveData = (afpToCreate) => {
    if (!afpToCreate.afp || !afpToCreate.tasa_afp || !afpToCreate.sis || !afpToCreate.tasa_afp_ind) {
      setMessage('Todos los campos son obligatorios.');
      return;
    }
  
    axios.post("http://127.0.0.1:8000/api/afps", afpToCreate)
      .then((response) => {
        console.log("Nueva AFP creada correctamente:", response.data);
        setMessage('AFP creada correctamente.');
  
        setNewAfp({ afp: "", tasa_afp: "", sis: "", tasa_afp_ind: "" });
  
        setTimeout(() => setMessage(''), 5000);
  
        axios.get("http://127.0.0.1:8000/api/afps")
          .then((response) => {
            setAfpData(response.data.data);
          })
          .catch((error) => {
            console.error("Error al obtener los datos actualizados:", error);
          });

        setOpenModal(false);
      })
      .catch((error) => {
        console.error("Error al crear la nueva AFP:", error);
        setMessage('Hubo un error al crear la AFP.');

        setTimeout(() => setMessage(''), 2000);
      });
  };

  return (
    <div className="containerFun">
      <nav className="navbarFun">
        <button className={currentSection === "AFP" ? "active" : ""} onClick={() => setCurrentSection("AFP")}>
          AFP
        </button>
        <button className={currentSection === "Indicadores" ? "active" : ""} onClick={() => setCurrentSection("Indicadores")}>
          Indicadores
        </button>
        <button className={currentSection === "Renta_Topes_Impon" ? "active" : ""} onClick={() => setCurrentSection("Renta_Topes_Impon")}>
          Rentas Topes Imponible
        </button>
        <button className={currentSection === "Rentas_Min_Impon." ? "active" : ""} onClick={() => setCurrentSection("Rentas_Min_Impon.")}>
          Rentas Mínimas Imponibles
        </button>
        <button className={currentSection === "Asignacion_Familiar" ? "active" : ""} onClick={() => setCurrentSection("Asignacion_Familiar")}>
          Asignación Familiar
        </button>
        <button className={currentSection === "APV" ? "active" : ""} onClick={() => setCurrentSection("APV")}>
          APV
        </button>
      </nav>

      {/*******************************SECCION AFP*****************************************************************************************/}

      {currentSection === "AFP" && (
        <Box sx={{ padding: "20px", backgroundColor: "white", borderRadius: "8px" }}>
        <Typography variant="h6" sx={{ marginBottom: "15px", fontWeight: "bold", color: "#333" }}>
          Tasa Cotización Obligatoria AFP
        </Typography>
      
        <TableContainer sx={{ boxShadow: 3, borderRadius: "8px", overflow: "hidden" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {["AFP", "Tasa AFP", "SIS", "Tasa AFP Independientes"].map((header, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#1976d2",
                      color: "white",
                      textAlign: "center"
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filledAfpData.map((row, index) => (
                <TableRow key={index}>
                  {["afp", "tasa_afp", "sis", "tasa_afp_ind"].map((field, i) => (
                    <TableCell key={i} sx={{ textAlign: "center" }}>
                      <TextField
                        size="small"
                        variant="outlined"
                        value={row[field]}
                        onChange={(e) => handleInputChange(e, index, field)}
                        InputProps={{
                          style: { backgroundColor: "#f4f4f4", color: "#333" }
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      
        <Box sx={{ marginTop: "15px", textAlign: "center" }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenModal(true)}
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              "&:hover": { backgroundColor: "#1565c0" }
            }}
          >
            Agregar AFP
          </Button>
        </Box>
      
        {/* Modal for Adding AFP */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Agregar Nueva AFP</DialogTitle>
          <DialogContent>
            {["Nombre AFP", "Tasa AFP", "Sis", "Tasa AFP Independiente"].map((field, i) => (
              <TextField
                key={i}
                label={field.toUpperCase()}
                variant="outlined"
                fullWidth
                margin="normal"
                value={newAfp[field]}
                onChange={(e) => setNewAfp({ ...newAfp, [field]: e.target.value })}
              />
            ))}
          </DialogContent>
          <DialogActions>
            {message && (
              <div style={{ marginTop: '20px', color: message.includes('correctamente') ? 'green' : 'red' }}>
                {message}
              </div>
            )}
            <Button onClick={() => setOpenModal(false)} color="error">
              Cancelar
            </Button>
            <Button onClick={() => saveData(newAfp)} variant="contained" color="primary">
              Agregar
            </Button>
          </DialogActions>
        </Dialog>
      
      </Box>
      )}

      {/*******************************SECCION INDICADORES*****************************************************************************************/}

        {currentSection === "Indicadores" && (
           <Box sx={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
           <Typography variant="h6" sx={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>
             Indicadores Mensuales (UF, UTM, UTA)
           </Typography>
           <TableContainer sx={{ boxShadow: 3, borderRadius: '8px', overflow: 'hidden' }}>
             <Table sx={{ minWidth: 650 }}>
               <TableHead>
                 <TableRow>
                   <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', textAlign: 'center' }}>
                     Mes
                   </TableCell>
                   <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', textAlign: 'center' }}>
                     UF
                   </TableCell>
                   <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', textAlign: 'center' }}>
                     UTM
                   </TableCell>
                   <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', textAlign: 'center' }}>
                     UTA
                   </TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {indicatorsData.map((row, index) => (
                   <TableRow key={index}>
                     <TableCell sx={{ textAlign: 'center' }}>{row.mes}</TableCell>
                     <TableCell sx={{ textAlign: 'center' }}>{row.uf}</TableCell>
                     <TableCell sx={{ textAlign: 'center' }}>{row.utm}</TableCell>
                     <TableCell sx={{ textAlign: 'center' }}>{row.uta}</TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </TableContainer>
         </Box>
        )}
      {/*******************************SECCION RENTA TOPE IMPONIBLE*****************************************************************************************/}

      {currentSection === "Renta_Topes_Impon" && (
        <Box sx={{ padding: "20px", backgroundColor: "white", borderRadius: "8px" }}>
        <Typography variant="h6" sx={{ marginBottom: "15px", fontWeight: "bold", color: "#333" }}>
          Rentas Mínimas Imponibles (RMI)
        </Typography>
  
        <TableContainer sx={{ boxShadow: 3, borderRadius: "8px", overflow: "hidden" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                  Concepto
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                  UF
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                  Monto
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rentasData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: "center" }}>{item.Concepto}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{item.UF}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}> {item.monto}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      )}

      {/*******************************SECCION RENTA MINIMA IMPONIBLE*****************************************************************************************/}

      {currentSection === "Rentas_Min_Impon." && (
        <Box sx={{ padding: "20px", backgroundColor: "white", borderRadius: "8px" }}>
        <Typography variant="h6" sx={{ marginBottom: "15px", fontWeight: "bold", color: "#333" }}>
          Rentas Mínimas Imponibles
        </Typography>
        <TableContainer sx={{ boxShadow: 3, borderRadius: "8px", overflow: "hidden" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                  Concepto
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                  Monto
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rentasMinimasData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: "center" }}>{row.Concepto}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{row.Monto}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      )}

      {/*******************************SECCION ASIGNACION FAMILIAR*****************************************************************************************/}

      {currentSection === "Asignacion_Familiar" && (
        <div>
          <h2>APV</h2>
          <p>Aquí puedes consultar el APV del funcionario.</p>
        </div>
      )}
    </div>
  );
}

export default IndicadoresFinan;
