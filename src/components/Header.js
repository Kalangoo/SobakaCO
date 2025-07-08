import React from 'react';
import './Header.css'; 

const PawLogo = () => (
    <svg className="logo-svg" viewBox="0 0 200 200" fill="currentColor">
      <circle cx="50" cy="55" r="25" />
      <circle cx="150" cy="55" r="25" />
      <circle cx="100" cy="35" r="25" />
      <path d="M 50,100 C 50,70 150,70 150,100 C 170,140 125,165 100,165 C 75,165 30,140 50,100 Z" />
    </svg>
  );


function Header({ user, onReportClick, onLoginClick, onLogoutClick }) {
  return (
    <header className="header-container">
      <div className="header-logo">
        <PawLogo />
        <h1>Sobaka</h1>
      </div>
      <nav className="header-nav">
        {user ? (
          <>
            <span className="welcome-message">Bem-vindo</span>
            <button onClick={onLogoutClick}>Sair</button>
          </>
        ) : (
          <button onClick={onLoginClick}>Login / Cadastro</button>
        )}
        <button onClick={onReportClick} className="report-button">
          Relatar um Pet
        </button>
      </nav>
    </header>
  );
}

export default Header;