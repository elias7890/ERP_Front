import React, { useState } from 'react';
import './Empresas.scss';

const Empresas = () => {
  const [isModifyModalOpen, setModifyModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  const openModifyModal = (empresa) => {
    setSelectedEmpresa(empresa);
    setModifyModalOpen(true);
  };

  const openDeleteModal = (empresa) => {
    setSelectedEmpresa(empresa);
    setDeleteModalOpen(true);
  };

  const closeModals = () => {
    setModifyModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedEmpresa(null);
  };

  const handleSaveChanges = () => {
    console.log('Datos modificados:', selectedEmpresa);
    closeModals();
  };

  const handleConfirmDelete = () => {
    console.log('Empresa eliminada:', selectedEmpresa);
    closeModals();
  };

  return (
    <div className="empresas-container">
      <h1>Lista de Empresas</h1>
      <table className="tabla">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre Empresa</th>
            <th>RUT</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>001</td>
            <td>Empresa ABC</td>
            <td>12.345.678-9</td>
            <td>
              <button className="btn modificar" onClick={() => openModifyModal({ codigo: '001', nombre: 'Empresa ABC', rut: '12.345.678-9' })}>Modificar</button>
              <button className="btn eliminar" onClick={() => openDeleteModal({ codigo: '001', nombre: 'Empresa ABC', rut: '12.345.678-9' })}>Eliminar</button>
            </td>
          </tr>
          <tr>
            <td>002</td>
            <td>Empresa XYZ</td>
            <td>98.765.432-1</td>
            <td>
              <button className="btn modificar" onClick={() => openModifyModal({ codigo: '002', nombre: 'Empresa XYZ', rut: '98.765.432-1' })}>Modificar</button>
              <button className="btn eliminar" onClick={() => openDeleteModal({ codigo: '002', nombre: 'Empresa XYZ', rut: '98.765.432-1' })}>Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Modal de Modificar */}
      {isModifyModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Modificar Empresa</h2>
            <label>Código:</label>
            <input type="text" value={selectedEmpresa.codigo} disabled />
            <label>Nombre Empresa:</label>
            <input type="text" value={selectedEmpresa.nombre} onChange={(e) => setSelectedEmpresa({ ...selectedEmpresa, nombre: e.target.value })} />
            <label>RUT:</label>
            <input type="text" value={selectedEmpresa.rut} onChange={(e) => setSelectedEmpresa({ ...selectedEmpresa, rut: e.target.value })} />
            <div className="modal-buttons">
              <button onClick={handleSaveChanges}>Guardar</button>
              <button onClick={closeModals}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Eliminar */}
      {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirmar Eliminación</h2>
            <p>¿Estás seguro que deseas eliminar la empresa {selectedEmpresa.nombre}?</p>
            <div className="modal-buttons">
              <button onClick={handleConfirmDelete}>Confirmar</button>
              <button onClick={closeModals}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Empresas;
