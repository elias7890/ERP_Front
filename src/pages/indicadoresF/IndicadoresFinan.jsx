import React, { useState, useEffect } from "react";
import axios from "axios";
import "./IndicadoresFinan.scss";
import { Table, TableBody, TableCell, Modal, TableContainer, TableHead, TableRow, TextField, Button, IconButton, Typography, Box, Dialog, Grid,         
  DialogActions,       
  DialogContent,       
  DialogTitle,
  Snackbar,
  Alert         
  } from "@mui/material";
import { Add } from "@mui/icons-material";
import { actualizarIndicadores, obtenerIndicadoresPorMes, obtenerMesActual, getUltimoRegistro, crearRegistro, traerAsiganaciones, crearAsignacion } from "../../apis/indicador";

function IndicadoresFinan() {
  const [afpData, setAfpData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const [currentSection, setCurrentSection] = useState("AFP");
  const [indicadores, setIndicadores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mes, setMes] = useState('');
  const [indicatorsUF, setIndicatorsUF] = useState([]);
  const [rentasMin, setRentasMin] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [asignacionData, setAsignacionData] = useState([]);
  const [newAsignacion, setNewAsignacion] = useState({
    Tramo: '',
    Letra: '',
    Monto: '',
    RentaMin: '',
    RentaMax: ''
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formValues, setFormValues] = useState({
    trab_dependientes_independientes: "",
    menores_mayores_edad: "",
    trab_casa_particular: "",
    fines_no_remuneracionales: "",
  });
  const [rentasData, setRentasData] = useState([
    { Concepto: "Para afiliados a una AFP", UF: "84.3 UF", monto: "" },
    { Concepto: "Para afiliados al INP", UF: "60 UF", monto: "" },
    { Concepto: "Para Seguro de Cesantía", UF: "126.6 UF", monto: "" },
  ]);
  const [formData, setFormData] = useState({
    mes: '',
    uf: '',
    utm: '',
    uta: ''
  });

  useEffect(() => {
    const fetchAsignaciones = async () => {
      try {
        await traerAsiganaciones(setAsignacionData);
      } catch (error) {
        setSnackbarMessage('Error al cargar los datos de asignaciones.');
        setSnackbarOpen(true);
      }
    };
    fetchAsignaciones();
  }, []);
  useEffect(() => { 
    const mesActual = obtenerMesActual();
    setMes(mesActual);
    const formatoCLP = (valor) => {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(valor);
    };
    const formatoUF = (valor) => {
      return new Intl.NumberFormat('es-CL', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(valor);
    };
    const formatoMonto = (valor) => {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(valor);
    };
  
    const fetchIndicadores = async () => {
      try {
        const data = await obtenerIndicadoresPorMes(mesActual);  
        
        const indicadoresConFormato = data.map(indicador => ({
          ...indicador,
          uf: formatoUF(indicador.uf),  
          utm: formatoCLP(indicador.utm),  
          uta: formatoCLP(indicador.uta),
        }));
        
        setIndicadores(indicadoresConFormato);
  
        const ufValor = parseFloat(indicadoresConFormato[0]?.uf.replace(' UF', '').replace(/\./g, '').replace(',', '.'));
        if (!isNaN(ufValor)) {
          
          const rentasActualizadas = rentasData.map(renta => ({
            ...renta,
            monto: formatoMonto(parseFloat(renta.UF.replace(' UF', '')) * ufValor),  
          }));
          setRentasData(rentasActualizadas);  
        }
      } catch (error) {
        console.error('Error al obtener los indicadores:', error);
      } finally {
        setCargando(false);  
      }
    };
  
    fetchIndicadores();  
  }, []); 
  
  useEffect(() => {
    
    const fetchRentasData = async () => {
      try {
       
        const data = await getUltimoRegistro();
      
        const formattedMin = [
          { Concepto: "Trab. Dependientes e Independientes", monto: data.trab_dependientes_independientes },
          { Concepto: "Menores de 18 y Mayores de 65", monto: data.menores_mayores_edad },
          { Concepto: "Trabajadores de Casa Particular", monto: data.trab_casa_particular },
          { Concepto: "Para fines no remuneracionales", monto: data.fines_no_remuneracionales },
        ];
        // Actualizamos el estado de rentasMin con los datos formateados
        setRentasMin(formattedMin);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
  
    fetchRentasData(); 
  }, []); 
  const handleSubmitRentas = async () => {
    try {
      await crearRegistro(formValues);
      handleCloseModal();  
      
      const data = await getUltimoRegistro();
      const formattedMin = [
        { Concepto: "Trab. Dependientes e Independientes", monto: data.trab_dependientes_independientes },
        { Concepto: "Menores de 18 y Mayores de 65", monto: data.menores_mayores_edad },
        { Concepto: "Trabajadores de Casa Particular", monto: data.trab_casa_particular },
        { Concepto: "Para fines no remuneracionales", monto: data.fines_no_remuneracionales },
      ];
      setRentasMin(formattedMin);
    } catch (error) {
      console.error("Error al guardar datos:", error);
    }
  };
  
  const handleOpen = (modalType) => {
    setOpen({ type: modalType, status: true });
  };

  const handleClose = () => {
    setOpen({ type: '', status: false });
  };
  const handleChangeAsignacion = (event) => {
    const {name, value } = event.target;
    setNewAsignacion({ ...newAsignacion, [name]: value});
  } 
 
  const handleChangeIndicadores = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSumitAsignaciones = async (e) => {
    e.preventDefault();

    if(!newAsignacion.Tramo || !newAsignacion.Letra || !newAsignacion.Monto){
      setSnackbarMessage('Por favor, complete todos los campos obligatorios.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await crearAsignacion(newAsignacion);
      if (response.success){
        setAsignacionData([...asignacionData, newAsignacion]);
        setSnackbarMessage('Registro agregado con éxito');
        setSnackbarOpen(true);
        handleCloseModal();
      }else{
        throw new Error (response.message || "Error al agregar el registro.") 
      }
    } catch (error) {
      setSnackbarMessage(error.message || "Error al guardar el resgistro.")
      setSnackbarOpen(true); 
    }
  };
  const handleSnackbarclose = () => {
    setSnackbarOpen(false);
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const result = await actualizarIndicadores(formData); 
      console.log('Datos actualizados:', result);
      setIndicatorsUF([...indicatorsUF, formData]);
      handleClose();
      setFormData({ mes: '', uf: '', utm: '', uta: '' });
    } catch (error) {
      console.error('Error al guardar el registro:', error);
    }
  };


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
 
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewAsignacion({ Tramo: '', Letra: '', Monto: '', RentaMin: '', RentaMax: '' });
  }

  const handleInputRentas = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

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
     
           {/* Botón para abrir el modal de agregar un registro */}
           <Button variant="contained" color="primary" onClick={() => handleOpen('add')}>
             Agregar Registro
           </Button>
     
           <TableContainer sx={{ boxShadow: 3, borderRadius: '8px', overflow: 'hidden', marginTop: '20px' }}>
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
                 {indicadores.map((indicador, index) => (
                   <TableRow key={index}>
                     <TableCell sx={{ textAlign: 'center' }}>{indicador.mes}</TableCell>
                     <TableCell sx={{ textAlign: 'center' }}>${indicador.uf}</TableCell>
                     <TableCell sx={{ textAlign: 'center' }}>{indicador.utm}</TableCell>
                     <TableCell sx={{ textAlign: 'center' }}>{indicador.uta}</TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </TableContainer>
     
           {/* Modal para agregar un nuevo registro */}
           <Modal
             open={open.status && open.type === 'add'}
             onClose={handleClose}
             aria-labelledby="modal-title"
             aria-describedby="modal-description"
           >
             <Box
               sx={{
                 position: 'absolute',
                 top: '50%',
                 left: '50%',
                 transform: 'translate(-50%, -50%)',
                 backgroundColor: 'white',
                 padding: '20px',
                 borderRadius: '8px',
                 width: '300px',
                 boxShadow: 3,
               }}
             >
               <Typography id="modal-title" variant="h6" sx={{ marginBottom: '15px' }}>
                 Agregar Indicador
               </Typography>
               <form onSubmit={handleSubmit}>
                 <Grid container spacing={2}>
                   <Grid item xs={12}>
                     <TextField
                       fullWidth
                       label="Mes"
                       name="mes"
                       value={formData.mes}
                       onChange={handleChangeIndicadores}
                       required
                     />
                   </Grid>
                   <Grid item xs={12}>
                     <TextField
                       fullWidth
                       label="UF"
                       name="uf"
                       type="number"
                       value={formData.uf}
                       onChange={handleChangeIndicadores}
                       required
                     />
                   </Grid>
                   <Grid item xs={12}>
                     <TextField
                       fullWidth
                       label="UTM"
                       name="utm"
                       type="number"
                       value={formData.utm}
                       onChange={handleChangeIndicadores}
                       required
                     />
                   </Grid>
                   <Grid item xs={12}>
                     <TextField
                       fullWidth
                       label="UTA"
                       name="uta"
                       type="number"
                       value={formData.uta}
                       onChange={handleChangeIndicadores}
                       required
                     />
                   </Grid>
                   <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                   <Button type="submit" variant="contained" color="primary">
                     Guardar
                  </Button>
                   </Grid>
                 </Grid>
               </form>
             </Box>
           </Modal>
         </Box>
        )}
      {/*******************************SECCION RENTA TOPE IMPONIBLE*****************************************************************************************/}

      {currentSection === "Renta_Topes_Impon" && (
        <Box sx={{ padding: "20px", backgroundColor: "white", borderRadius: "8px" }}>
        <Typography variant="h6" sx={{ marginBottom: "15px", fontWeight: "bold", color: "#333" }}>
          Rentas Topes Imponibles 
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
         <Typography
           variant="h6"
           sx={{ marginBottom: "15px", fontWeight: "bold", color: "#333" }}
         >
           Rentas Mínimas Imponibles 
         </Typography>
   
         <Button
           variant="contained"
           color="primary"
           sx={{ marginBottom: "15px" }}
           onClick={handleOpenModal}
         >
           Agregar Datos
         </Button>
   
         <TableContainer sx={{ boxShadow: 3, borderRadius: "8px", overflow: "hidden" }}>
           <Table sx={{ minWidth: 650 }}>
             <TableHead>
               <TableRow>
                 <TableCell
                   sx={{
                     fontWeight: "bold",
                     backgroundColor: "#1976d2",
                     color: "white",
                     textAlign: "center",
                   }}
                 >
                   Concepto
                 </TableCell>
                 <TableCell
                   sx={{
                     fontWeight: "bold",
                     backgroundColor: "#1976d2",
                     color: "white",
                     textAlign: "center",
                   }}
                 >
                   Monto 
                 </TableCell>
               </TableRow>
             </TableHead>
             <TableBody>
               {rentasMin.map((item, index) => (
                 <TableRow key={index}>
                   <TableCell sx={{ textAlign: "center" }}>{item.Concepto}</TableCell>
                   <TableCell sx={{ textAlign: "center" }}>
                     {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(item.monto)}
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </TableContainer>
   
         {/* Modal for adding new data */}
         <Modal open={isModalOpen} onClose={handleCloseModal}>
           <Box
             sx={{
               position: "absolute",
               top: "50%",
               left: "50%",
               transform: "translate(-50%, -50%)",
               width: 400,
               bgcolor: "background.paper",
               boxShadow: 24,
               p: 4,
               borderRadius: 2,
             }}
           >
             <Typography variant="h6" sx={{ marginBottom: "15px" }}>
               Agregar Datos
             </Typography>
             <TextField
               label="Trab. Dependientes e Independientes"
               fullWidth
               sx={{ marginBottom: "15px" }}
               name="trab_dependientes_independientes"
               value={formValues.trab_dependientes_independientes}
               onChange={ handleInputRentas}
             />
             <TextField
               label="Menores de 18 y Mayores de 65"
               fullWidth
               sx={{ marginBottom: "15px" }}
               name="menores_mayores_edad"
               value={formValues.menores_mayores_edad}
               onChange={ handleInputRentas}
             />
             <TextField
               label="Trabajadores de Casa Particular"
               fullWidth
               sx={{ marginBottom: "15px" }}
               name="trab_casa_particular"
               value={formValues.trab_casa_particular}
               onChange={ handleInputRentas}
             />
             <TextField
               label="Para fines no remuneracionales"
               fullWidth
               sx={{ marginBottom: "15px" }}
               name="fines_no_remuneracionales"
               value={formValues.fines_no_remuneracionales}
               onChange={ handleInputRentas}
             />
             <Button
               variant="contained"
               color="primary"
               onClick={handleSubmitRentas}
               fullWidth
             >
               Guardar
             </Button>
           </Box>
         </Modal>
       </Box>
      )}

      {/*******************************SECCION ASIGNACION FAMILIAR*****************************************************************************************/}

      {currentSection === "Asignacion_Familiar" && (
      <Box sx={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
      <Typography variant="h6" sx={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>
        Asignación Familiar
      </Typography>
    
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        sx={{ marginBottom: '20px' }}
      >
        Agregar Nuevo Registro
      </Button>
    
      <TableContainer sx={{ boxShadow: 3, borderRadius: '8px', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', textAlign: 'center' }}>
                Tramo
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', textAlign: 'center' }}>
                Letra
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', textAlign: 'center' }}>
                Monto
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', textAlign: 'center' }}>
                Renta Mínima
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', textAlign: 'center' }}>
                Renta Máxima
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {asignacionData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center' }}>Cargando Asignaciones...</TableCell>
            </TableRow>
          ) : (
            asignacionData.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ textAlign: 'center' }}>{item.Tramo ?? 'N/A'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{item.Letra ?? 'N/A'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {item.Monto !== null ? `$${parseFloat(item.Monto).toLocaleString()}` : 'N/A'}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {item.RentaMin !== null ? `$${parseFloat(item.RentaMin).toLocaleString()}` : 'N/A'}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {item.RentaMax !== null ? `$${parseFloat(item.RentaMax).toLocaleString()}` : 'N/A'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        </Table>
      </TableContainer>
    
      {/* Modal para agregar datos */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: 24,
            width: '400px',
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: '15px' }}>
            Agregar Asignación Familiar
          </Typography>
          <form onSubmit={handleSumitAsignaciones}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tramo"
                  name="Tramo"
                  type="number"
                  value={newAsignacion.Tramo}
                  onChange={handleChangeAsignacion}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Letra"
                  name="Letra"
                  value={newAsignacion.Letra}
                  onChange={handleChangeAsignacion}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Monto"
                  name="Monto"
                  type="number"
                  value={newAsignacion.Monto}
                  onChange={handleChangeAsignacion}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Renta Mínima"
                  name="RentaMin"
                  type="number"
                  value={newAsignacion.RentaMin}
                  onChange={handleChangeAsignacion}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Renta Máxima"
                  name="RentaMax"
                  type="number"
                  value={newAsignacion.RentaMax}
                  onChange={handleChangeAsignacion}
                />
              </Grid>
            </Grid>
            <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Guardar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    
      {/* Snackbar para mostrar mensaje */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage.includes('Error') ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
      )}
    </div>
    
  );


}

export default IndicadoresFinan;
