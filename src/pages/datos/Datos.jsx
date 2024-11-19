import React, { useState, useEffect } from 'react';
import './Datos.scss';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);

  // Simulación de llamada a una API
  useEffect(() => {
    // Aquí podrías usar fetch o axios para traer datos reales desde una API
    const fetchData = async () => {
      const response = await fetch('https://api.example.com/user/1');
      const data = await response.json();
      setUserData(data);
    };

    // Simulación de datos de ejemplo
    setTimeout(() => {
      setUserData({
        name: 'Francisca Bárbara Tapia Reyes',
        rut: '20.183.653-7',
        address: 'Población Don Sebastián #139, Sagrada Familia',
        personal: {
          birthDate: '1990-01-01',
          maritalStatus: 'Soltera',
          nationality: 'Chilena',
          children: 0,
          phone: '+56912345678',
          email: 'francisca.tapia@example.com',
        },
        social: {
          afp: 'Habitat',
          health: 'Fonasa',
        },
        bank: {
          bankName: 'Banco Estado',
          accountNumber: '123456789',
          accountType: 'Cuenta Corriente',
        },
        emergencyContact: {
          name: 'María Tapia',
          phone: '+56987654321',
          address: 'Población Don Sebastián #150, Sagrada Familia',
        },
      });
    }, 1000); // Simulación de delay
  }, []);

  if (!userData) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="container">
      <div className="tabs">
        <div className="tab active">Datos</div>
        <div className="tab">Documentos</div>
        <div className="tab">Liquidaciones</div>
        <div className="tab">Lic Médicas</div>
        <div className="tab">Vacaciones</div>
        <div className="tab">Historial</div>
      </div>

      <div className="profile">
        <div className="left">
          <div className="profile-picture"></div>
          <h2>{userData.name}</h2>
          <p><strong>RUT:</strong> {userData.rut}</p>
          <p><strong>Dirección:</strong> {userData.address}</p>
        </div>
        <div className="right">
          <h3>Antecedentes Personales</h3>
          <p><strong>Fecha de nacimiento:</strong> {userData.personal.birthDate}</p>
          <p><strong>Estado civil:</strong> {userData.personal.maritalStatus}</p>
          <p><strong>Nacionalidad:</strong> {userData.personal.nationality}</p>
          <p><strong>Número de hijos:</strong> {userData.personal.children}</p>
          <p><strong>Teléfono:</strong> {userData.personal.phone}</p>
          <p><strong>Email:</strong> {userData.personal.email}</p>

          <h3>Previsión Social</h3>
          <p><strong>Afp:</strong> {userData.social.afp}</p>
          <p><strong>Salud:</strong> {userData.social.health}</p>

          <h3>Datos Bancarios</h3>
          <p><strong>Banco:</strong> {userData.bank.bankName}</p>
          <p><strong>N° Cuenta:</strong> {userData.bank.accountNumber}</p>
          <p><strong>Tipo de cuenta:</strong> {userData.bank.accountType}</p>

          <h3>Antecedentes Familiares</h3>
          <p><strong>Persona de contacto de emergencia:</strong> {userData.emergencyContact.name}</p>
          <p><strong>Teléfono:</strong> {userData.emergencyContact.phone}</p>
          <p><strong>Dirección:</strong> {userData.emergencyContact.address}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
