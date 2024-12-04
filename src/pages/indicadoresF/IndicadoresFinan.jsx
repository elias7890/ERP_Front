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
          <Box sx={{ padding: "20px", backgroundColor: "white", borderRadius: "8px" }}>
            <Typography variant="h6" sx={{ marginBottom: "15px", fontWeight: "bold", color: "#333" }}>
              Indicadores Mensuales (UF, UTM, UTA)
            </Typography>
            <TableContainer sx={{ boxShadow: 3, borderRadius: "8px", overflow: "hidden" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                      Mes
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                      UF
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                      UTM
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                      UTA
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {indicatorsData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ textAlign: "center" }}>{row.mes}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{row.uf}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{row.utm}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{row.uta}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      {/*******************************SECCION RENTA TOPE IMPONIBLE*****************************************************************************************/}

      {currentSection === "Renta_Topes_Impon" && (
        <div>
          <h2>Rentas Topes Imponible</h2>
          <p>Aquí puedes gestionar las rentas topes imponibles.</p>
        </div>
      )}

      {/*******************************SECCION ASIGNACION FAMILIAR*****************************************************************************************/}

      {currentSection === "Asignacion_Familiar" && (
        <div>
          <h2>Asignación Familiar</h2>
          <p>Aquí puedes gestionar la asignación familiar del funcionario.</p>
        </div>
      )}

      {/*******************************SECCION APV*****************************************************************************************/}

      {currentSection === "APV" && (
        <div>
          <h2>APV</h2>
          <p>Aquí puedes consultar el APV del funcionario.</p>
        </div>
      )}
    </div>
  );
}

export default IndicadoresFinan;
