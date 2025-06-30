import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" 
            required 
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
        </button>
        <button type="button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default AuthModal;