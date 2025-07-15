import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./Navbar.scss";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Recherche pour:", searchQuery);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Section gauche - Logo */}
        <div className="navbar-left">
          <NavLink
            to="/"
            className="navbar-brand"
          >
            <Icon icon="game-icons:house" className="logo-icon" />
            <span className="brand-text">My Happy mo</span>
            <span className="brand-emoji">🏠</span>
          </NavLink>
        </div>

        {/* Section centre - Menu principal */}
        <div className="navbar-center">
          <div className="navbar-menu">
            <button
              className="nav-link active"
              onClick={() => navigate("/appartements")}
            >
              <Icon icon="game-icons:village" width="18" />
              <span>Appartements</span>
            </button>
            <NavLink
              to="/contacts"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              <Icon icon="mdi:card-account-details-outline" width="18" />
              <span>Contacts</span>
            </NavLink>
            <NavLink
              to="/memos"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              <Icon icon="mdi:note-text-outline" width="18" />
              <span>Mémos</span>
            </NavLink>
          </div>
          
        </div>

        {/* Section droite - Recherche + Admin */}
        <div className="navbar-right">
          {/* Barre de recherche */}
          <div className="navbar-search">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-container">
                <Icon icon="mdi:magnify" className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="clear-search"
                  >
                    <Icon icon="mdi:close" />
                  </button>
                )}
              </div>
            </form>
          </div>
          
          {/* Bouton Admin */}
          <div className="navbar-profile">
            <button
              type="button"
              className="admin-button"
              onClick={handleLogout}
              title="Déconnexion"
            >
              <Icon icon="mdi:logout" className="logout-icon" />
              <div className="avatar">👩‍💼</div>
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
