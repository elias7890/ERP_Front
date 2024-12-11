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
import { actualizarIndicadores, obtenerIndicadoresPorMes, obtenerMesActual, 
         getUltimoRegistro, crearRegistro, traerAsiganaciones, crearAsignacion, listarAfps, createAfp, obtenerTodosIndicadores } from "../../apis/indicador";

function IndicadoresFinan() {
  const [currentSection, setCurrentSection] = useState("AFP");
  const [cargando, setCargando] = useState(true);
  const [indicatorsUF, setIndicatorsUF] = useState([]);
  const [rentasMin, setRentasMin] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [asignacionData, setAsignacionData] = useState([]);
  /*de la tabla indicadores*/
  const [indicadores, setIndicadores] = useState([]);
  const [mes, setMes] = useState('');
  const [editIndexIn, setEditIndexIn] = useState(null);
  const [editedDataIn, setEditedDataIn] = useState({});
  const [modalOpenIn, setModalOpenIn] = useState(false);
  const [modalTodosOpen, setModalTodosOpen] = useState(false);
  const [todosIndicadores, setTodosIndicadores] = useState([]);
  /*Fin de la tabla indicadores */
  const [afpData, setAfpData] = useState([]);
  const [editIndex, setEditIndex] = useState(null); 
  const [newData, setNewData] = useState({});
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
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
    const fetchAfps = async () => {
      try {
        const response = await listarAfps(); // Llamamos al servicio
        console.log("Datos recibidos de la API:", response);
        
        if (response && response.data && Array.isArray(response.data)) {
          setAfpData(response.data); // Asignamos los datos al estado
        } else {
          setSnackbarMessage('Error: No se encontraron datos de AFP.');
          setSnackbarOpen(true);
          setAfpData([]);
        }
      } catch (error) {
        setSnackbarMessage('Error al cargar los datos de AFP.');
        setSnackbarOpen(true);
      }
    };

    fetchAfps(); // Llamar al servicio cuando se monta el componente
  }, []);
 
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
  
  const handleChangeAsignacion = (event) => {
    const {name, value } = event.target;
    setNewAsignacion({ ...newAsignacion, [name]: value});
  } 
 
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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewAsignacion({ Tramo: '', Letra: '', Monto: '', RentaMin: '', RentaMax: '' });
  }

  const handleInputRentas = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  
  const handleInputChange = (e, field) => {
    setNewData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  const handleEdit = (index, afp) => {
    setEditIndex(index); // Establecer el índice de la fila que se va a editar
    setNewData({
      afp: afp.afp,
      tasa_afp: afp.tasa_afp,
      sis: afp.sis,
      tasa_afp_ind: afp.tasa_afp_ind,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setOpenModal(true); // Abrir el modal al presionar "Enter"
    }
  };
  const fetchAfpData = async () => {
    try {
      const response = await listarAfps(); // Servicio que lista las AFP
      setAfpData(response.data); // Actualizar el estado con los nuevos datos
    } catch (error) {
      console.error("Error al cargar los datos de AFP:", error);
    }
  };

  // Guardar cambios
  const handleSave = async () => {
    try {
      // Llamar al servicio para crear un nuevo registro
      const response = await createAfp(newData);
      if (response.status === 200) {
        await fetchAfpData();
        setAfpData((prevData) => [...prevData, newData]); // Agregar el nuevo registro localmente
        setMessage('Registro creado correctamente.');
      } else {
        setMessage('Error al crear el registro.');
      }
      await fetchAfpData();
    } catch (error) {
      setMessage('Ocurrió un error al intentar guardar el registro.');
    }
    setOpenModal(false);
    setEditIndex(null); // Restablecer editIndex
  };

  /*Tabla indicadores */
  const cargarIndicadores = async () => {
    try {
      const datos = await obtenerIndicadoresPorMes(mes);
      setIndicadores(Array.isArray(datos) ? datos : [datos]); 
    } catch (error) {
      console.error("Error al cargar los indicadores:", error);
    }
  };

  useEffect(() => {
    cargarIndicadores(); 
  }, [mes]); 

  const cargarTodosIndicadores = async () => {
    try {
      const datos = await obtenerTodosIndicadores(); 
      setTodosIndicadores(Array.isArray(datos) ? datos : [datos]);
    } catch (error) {
      console.error("Error al cargar todos los indicadores:", error);
    }
  };

  // Manejar el cambio en los valores editados
  const handleInputChangeIn = (e, field) => {
    setEditedDataIn({
      ...editedDataIn,
      [field]: e.target.value,
    });
  };

    // Iniciar la edición
  const handleEditIn = (index, indicador) => {
    setEditIndexIn(index);
    setEditedDataIn({ ...indicador });
  };

  const handleConfirm = async () => {
    setModalOpenIn(false);
    try {
      const payload = {
        mes: editedDataIn.mes,
        uf: parseFloat(editedDataIn.uf),
        utm: parseFloat(editedDataIn.utm),
        uta: parseFloat(editedDataIn.uta),
      };
      await actualizarIndicadores(payload);
      console.log("Datos enviados correctamente:", payload);
      setIndicadores((prev) =>
        prev.map((item, index) =>
          index === editIndexIn ? { ...item, ...editedDataIn } : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
    setEditIndexIn(null);
    setEditedDataIn({});
  };

  const handleCancel = () => {
    setModalOpenIn(false);
    setEditIndexIn(null);
    setEditedDataIn({});
  };

  const handleKeyDownIn = (e) => {
    if (e.key === "Enter") {
      setModalOpenIn(true);
    }
  };

  // Formatear moneda CLP
  const formatCurrency = (value, decimals = 0) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
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
       
         <TableContainer sx={{ boxShadow: 3, borderRadius: "8px", overflow: "hidden", padding: "4px 8px" }}>
           <Table sx={{ minWidth: 650 }}>
             <TableHead>
               <TableRow>
                 {["AFP", "Tasa AFP", "SIS", "Tasa AFP Independientes", "Fecha de Actualización"].map((header, i) => (
                   <TableCell
                     key={i}
                     sx={{
                       fontWeight: "bold",
                       backgroundColor: "#1976d2",
                       color: "white",
                       textAlign: "center",
                       
                     }}
                   >
                     {header}
                   </TableCell>
                 ))}
               </TableRow>
             </TableHead>
             <TableBody>
               {afpData.length > 0 ? (
                 afpData.map((afp, index) => (
                   <TableRow key={index}>
                     <TableCell onClick={() => handleEdit(index, afp)} sx={{ textAlign: "center" }}>
                       {editIndex === index ? (
                         <TextField
                           value={newData.afp}
                           onChange={(e) => handleInputChange(e, 'afp')}
                           onKeyDown={handleKeyDown} // Detectar la tecla "Enter"
                           variant="outlined"
                           size="small"
                         />
                       ) : (
                         afp.afp
                       )}
                     </TableCell>
                     <TableCell onClick={() => handleEdit(index, afp)} sx={{ textAlign: "center" }}>
                       {editIndex === index ? (
                         <TextField
                           value={newData.tasa_afp}
                           onChange={(e) => handleInputChange(e, 'tasa_afp')}
                           onKeyDown={handleKeyDown}
                           variant="outlined"
                           size="small"
                         />
                       ) : (
                         afp.tasa_afp
                       )}
                     </TableCell>
                     <TableCell onClick={() => handleEdit(index, afp)} sx={{ textAlign: "center" }}>
                       {editIndex === index ? (
                         <TextField
                           value={newData.sis}
                           onChange={(e) => handleInputChange(e, 'sis')}
                           onKeyDown={handleKeyDown}
                           variant="outlined"
                           size="small"
                         />
                       ) : (
                         afp.sis
                       )}
                     </TableCell>
                     <TableCell onClick={() => handleEdit(index, afp)} sx={{ textAlign: "center" }}>
                       {editIndex === index ? (
                         <TextField
                           value={newData.tasa_afp_ind}
                           onChange={(e) => handleInputChange(e, 'tasa_afp_ind')}
                           onKeyDown={handleKeyDown}
                           variant="outlined"
                           size="small"
                         />
                       ) : (
                         afp.tasa_afp_ind
                       )}
                     </TableCell>
                     {/* Nueva columna de Fecha de Actualización */}
                     <TableCell sx={{ textAlign: "center"}}>
                        {editIndex === index ? (
                          <TextField
                            value={newData.fecha_actualizacion}
                            onChange={(e) => handleInputChange(e, 'fecha_actualizacion')}
                            onKeyDown={handleKeyDown}
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          // Convertir la fecha de created_at a formato legible
                          new Date(afp.created_at).toLocaleDateString("es-CL", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                        )}
                      </TableCell>
                   </TableRow>
                 ))
               ) : (
                 <TableRow>
                   <TableCell colSpan={5} align="center">No se encontraron datos.</TableCell>
                 </TableRow>
               )}
             </TableBody>
           </Table>
         </TableContainer>
       
         {/* Modal de confirmación */}
         <Dialog open={openModal} onClose={() => setOpenModal(false)}>
           <DialogTitle>Confirmar Guardado</DialogTitle>
           <DialogContent>
             <Typography>
               ¿Estás seguro de guardar este nuevo registro de AFP?
             </Typography>
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
             <Button onClick={handleSave} variant="contained" color="primary">
               Guardar
             </Button>
           </DialogActions>
         </Dialog>
       </Box>
      )}

      {/*******************************SECCION INDICADORES*****************************************************************************************/}
        {currentSection === "Indicadores" && (
         <Box sx={{ padding: "20px", backgroundColor: "white", borderRadius: "8px" }}>
         <Typography
           variant="h6"
           sx={{ marginBottom: "15px", fontWeight: "bold", color: "#333" }}
         >
           Indicadores Mensuales (UF, UTM, UTA)
         </Typography>
   
         <Button
           variant="contained"
           color="primary"
           sx={{ marginBottom: "15px" }}
           onClick={() => {
             cargarTodosIndicadores();
             setModalTodosOpen(true);
           }}
         >
           Ver Todos los Registros
         </Button>
   
         <TableContainer
           sx={{ boxShadow: 3, borderRadius: "8px", overflow: "hidden" }}
         >
           <Table sx={{ minWidth: 650 }}>
             <TableHead>
               <TableRow>
                 {["Mes", "UF", "UTM", "UTA", "Fecha de actualización"].map(
                   (header, i) => (
                     <TableCell
                       key={i}
                       sx={{
                         fontWeight: "bold",
                         backgroundColor: "#1976d2",
                         color: "white",
                         textAlign: "center",
                       }}
                     >
                       {header}
                     </TableCell>
                   )
                 )}
               </TableRow>
             </TableHead>
             <TableBody>
               {indicadores.map((indicador, index) => (
                 <TableRow key={index}>
                   {["mes", "uf", "utm", "uta"].map((field, i) => (
                     <TableCell
                       key={i}
                       onClick={() => handleEditIn(index, indicador)}
                     >
                       {editIndexIn === index && field !== "mes" ? (
                         <TextField
                           value={editedDataIn[field] || ""}
                           onChange={(e) => handleInputChangeIn(e, field)}
                           onKeyDown={handleKeyDownIn}
                           variant="outlined"
                           size="small"
                           fullWidth
                         />
                       ) : field === "uf" || field === "utm" ? (
                         formatCurrency(indicador[field], 2)
                       ) : field === "uta" ? (
                         formatCurrency(indicador[field], 0)
                       ) : (
                         indicador[field]
                       )}
                     </TableCell>
                   ))}
                   <TableCell>
                     {indicador.created_at
                       ? new Date(indicador.created_at).toLocaleDateString("es-CL", {
                           day: "2-digit",
                           month: "2-digit",
                           year: "numeric",
                         })
                       : "Sin fecha"}
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </TableContainer>
   
         {/* Modal de confirmación */}
         <Modal open={modalOpenIn} onClose={handleCancel}>
           <Box
             sx={{
               position: "absolute",
               top: "50%",
               left: "50%",
               transform: "translate(-50%, -50%)",
               backgroundColor: "white",
               padding: "20px",
               borderRadius: "8px",
               boxShadow: 3,
             }}
           >
             <Typography variant="h6">¿Confirmar los cambios?</Typography>
             <Box
               sx={{
                 marginTop: "20px",
                 display: "flex",
                 justifyContent: "space-between",
               }}
             >
               <Button onClick={handleCancel} color="error" variant="contained">
                 Cancelar
               </Button>
               <Button onClick={handleConfirm} color="primary" variant="contained">
                 Confirmar
               </Button>
             </Box>
           </Box>
         </Modal>
   
         {/* Modal de todos los registros */}
         <Modal open={modalTodosOpen} onClose={() => setModalTodosOpen(false)}>
           <Box
             sx={{
               position: "absolute",
               top: "50%",
               left: "50%",
               transform: "translate(-50%, -50%)",
               backgroundColor: "white",
               padding: "20px",
               borderRadius: "8px",
               boxShadow: 3,
               width: "80%",
               maxHeight: "80%",
               overflowY: "auto",
             }}
           >
             <Typography variant="h6" sx={{ marginBottom: "15px" }}>
               Todos los Registros
             </Typography>
             <TableContainer>
               <Table>
                 <TableHead>
                   <TableRow>
                     {["Mes", "UF", "UTM", "UTA", "Fecha de actualización"].map(
                       (header, i) => (
                         <TableCell
                           key={i}
                           sx={{
                             fontWeight: "bold",
                             backgroundColor: "#1976d2",
                             color: "white",
                             textAlign: "center",
                           }}
                         >
                           {header}
                         </TableCell>
                       )
                     )}
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {todosIndicadores.map((indicador, index) => (
                     <TableRow key={index}>
                       <TableCell>{indicador.mes}</TableCell>
                       <TableCell>{formatCurrency(indicador.uf, 2)}</TableCell>
                       <TableCell>{formatCurrency(indicador.utm, 2)}</TableCell>
                       <TableCell>{formatCurrency(indicador.uta, 0)}</TableCell>
                       <TableCell>
                         {new Date(indicador.created_at).toLocaleDateString(
                           "es-CL"
                         )}
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </TableContainer>
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
