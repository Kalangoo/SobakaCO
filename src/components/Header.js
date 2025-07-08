import React from 'react';
import './Header.css'; 

const PawLogo = () => (
  <svg className="logo-svg" viewBox="0 0 512 512" fill="currentColor">
    <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0 0 114.6 0 256s114.6 256 256 256zM159.3 192c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm192 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zM256 320c-44.2 0-80-17.9-80-40s35.8-40 80-40 80 17.9 80 40-35.8 40-80 40z"/>
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