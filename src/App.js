import React, { useState, useEffect } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import MapComponent from './components/MapComponent';
import ReportForm from './components/ReportForm';
import AuthModal from './components/AuthModal';
import './App.css';

const libraries = ['places']; // Enable places library for autocomplete

function App() {
  const [user, setUser] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setShowAuthModal(false); // Close auth modal on successful login
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleReportButtonClick = () => {
    if (user) {
      setShowReportForm(true);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className="App">
        <header className="App-header">
          <h1>Sobaka</h1>
          <div>
            {user ? (
              <>
                <span>Welcome, {user.email}</span>
                <button onClick={() => auth.signOut()}>Logout</button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)}>Login / Sign Up</button>
            )}
            <button onClick={handleReportButtonClick}>Report a Pet</button>
          </div>
        </header>
        
        <main>
          <MapComponent />
        </main>

        {showReportForm && <ReportForm onClose={() => setShowReportForm(false)} />}
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    </LoadScript>
  );
}

export default App;