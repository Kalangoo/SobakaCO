import React, { useState, useEffect } from 'react';
// The LoadScript component is no longer needed
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import MapComponent from './components/MapComponent';
import ReportForm from './components/ReportForm';
import AuthModal from './components/AuthModal';
import './App.css';

// We no longer need the 'libraries' constant

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

  // The return statement is now simpler, without the LoadScript wrapper
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sobaka</h1>
        <div>
          {user ? (
            <>
              <span>Bem vindo, {user.email}</span>
              <button onClick={() => auth.signOut()}>Logout</button>
            </>
          ) : (
            <button onClick={() => setShowAuthModal(true)}>Login / Registre-se</button>
          )}
          <button onClick={handleReportButtonClick}>Reportar Pet</button>
        </div>
      </header>
      
      <main>
        <MapComponent />
      </main>

      {showReportForm && <ReportForm onClose={() => setShowReportForm(false)} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default App;