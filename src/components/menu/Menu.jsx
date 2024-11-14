import React, { useState } from "react";
import { Link } from "react-router-dom";
import { menu } from "../../data";
import "./Menu.scss";

const Menu = () => {
  // Estado para manejar los submenús desplegables
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openSubMenuId, setOpenSubMenuId] = useState(null); // Para manejar los submenús

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const toggleSubMenu = (id) => {
    setOpenSubMenuId(openSubMenuId === id ? null : id);  // Cambiar entre mostrar u ocultar el submenú
  };

  return (
    <div className="menu">
      {menu.map((item) => (
        <div className="item" key={item.id}>
          <span 
            className="title" 
            onClick={() => toggleMenu(item.id)}  
          >
            {item.title}
          </span>

          {/* Mostrar submenú si openMenuId es igual al id del item */}
          {openMenuId === item.id && item.listItems.length > 0 && (
            <div className="subMenu">
              {item.listItems.map((listItem) => (
                <div key={listItem.id}>
                  {/* Si tiene subMenu, entonces se hace desplegable también */}
                  <Link 
                    to={listItem.url} 
                    className="listItem"
                    onClick={() => listItem.subMenu && toggleSubMenu(listItem.id)}
                  >
                    <img src={listItem.icon} alt={listItem.title} />
                    <span className="listItemTitle">{listItem.title}</span>
                  </Link>

                  {/* Si la opción tiene subMenu, mostramos las opciones del submenú */}
                  {listItem.subMenu && openSubMenuId === listItem.id && (
                    <div className="subMenuItems">
                      {listItem.subMenu.map((subItem) => (
                        <Link to={subItem.url} className="subMenuItem" key={subItem.id}>
                          <img src={subItem.icon} alt={subItem.title} />
                          <span className="subMenuItemTitle">{subItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Menu;



