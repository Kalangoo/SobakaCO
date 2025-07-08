import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import MapComponent from './components/MapComponent';
import ReportForm from './components/ReportForm';
import AuthModal from './components/AuthModal';
import Header from './components/Header'; // 1. IMPORTE O NOVO COMPONENTE
import './App.css'; 

function App() {
  const [user, setUser] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setShowAuthModal(false); 
      }
    });
    return () => unsubscribe(); 
  }, []);

  const handleReportButtonClick = () => {
    if (user) {
      setShowReportForm(true);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="App">
      {/* 2. USE O NOVO HEADER E PASSE AS PROPS NECESSÁRIAS */}
      <Header
        user={user}
        onReportClick={handleReportButtonClick}
        onLoginClick={() => setShowAuthModal(true)}
        onLogoutClick={() => auth.signOut()}
      />
      
      {/* 3. O HEADER ANTIGO FOI REMOVIDO DAQUI */}
      
      <main>
        <MapComponent />
      </main>

      {showReportForm && <ReportForm onClose={() => setShowReportForm(false)} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default App;