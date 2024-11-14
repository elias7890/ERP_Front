import { useState } from 'react';
import "./Navbar.scss"

const Navbar = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  

  const toggleSearchBar = () => {
    setShowSearchBar((prev) => !prev);
  };

  const toggleNotificationPanel = () => {
    setShowNotificationPanel((prev) => !prev);
  };

  

  return (
    <div className="navbar">
    <div className="logo">
      <img src="logo.svg" alt="Logo" />
      <span>SEI Ingeniería y Servicios</span>
    </div>
    <div className="icons">
      <button className="icon-button" onClick={toggleSearchBar}>
        <img src="/search.svg" alt="Buscar" />
      </button>
      
      {/* Barra de búsqueda, visible solo cuando `showSearchBar` es true */}
      {showSearchBar && (
        <input
          type="text"
          className="search-bar"
          placeholder="Buscar..."
        />
      )}
      
      <button className="icon-button">
        <img src="/app.svg" alt="Aplicaciones" />
      </button>
      <button className="icon-button">
        <img src="/expand.svg" alt="Expandir" />
      </button>

      {/* Botón de notificaciones y panel de notificaciones */}
      <button className="icon-button notification" onClick={toggleNotificationPanel}>
        <img src="/notifications.svg" alt="Notificaciones" />
        <span>1</span>
      </button>

      {showNotificationPanel && (
        <div className="notification-panel">
          <p>Notificaciones:</p>
          <ul>
            <li>Notificación 1</li>
            <li>Notificación 2</li>
            <li>Notificación 3</li>
          </ul>
        </div>
      )}

      <div className="user">
        <img src="" alt="" />
        <span>Elias</span>
      </div>
      <button className="icon-button">
        <img src="/settings.svg" alt="Configuraciones" />
      </button>
    </div>
  </div>
);

};

export default Navbar;