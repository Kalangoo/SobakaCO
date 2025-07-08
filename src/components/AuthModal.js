import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './Modal.css'; // Importa o CSS compartilhado dos modais

function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros antigos
    console.log(`1. Tentando fazer ${isLogin ? 'login' : 'cadastro'} com o email:`, email);

    try {
      console.log("2. Executando a chamada para o Firebase...");
      if (isLogin) {
        // Tentativa de Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("3. SUCESSO! Usuário logado:", userCredential.user.email);
      } else {
        // Tentativa de Cadastro
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("3. SUCESSO! Usuário cadastrado:", userCredential.user.email);
      }
      onClose(); // Fecha o modal no sucesso
    } catch (err) {
      // Se a chamada ao Firebase falhar, o código entra aqui
      console.error("!!! ERRO DO FIREBASE !!!");
      console.error("Código do Erro:", err.code);
      console.error("Mensagem do Erro:", err.message);
      
      // Define uma mensagem de erro mais amigável para o usuário
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          setError('Email ou senha inválidos. Tente novamente.');
      } else if (err.code === 'auth/wrong-password') {
          setError('Senha incorreta. Tente novamente.');
      } else if (err.code === 'auth/email-already-in-use') {
          setError('Este e-mail já está cadastrado.');
      } else if (err.code === 'auth/weak-password') {
          setError('A senha precisa ter no mínimo 6 caracteres.');
      } else {
          setError('Ocorreu um erro. Verifique suas credenciais.');
      }
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
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
            placeholder="Senha (mínimo 6 caracteres)" 
            required 
          />
          {error && <p className="error-message">{error}</p>}
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="close-button">Fechar</button>
            <button type="submit" className="submit-button">{isLogin ? 'Login' : 'Cadastrar'}</button>
          </div>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="switch-auth-button">
          {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça o login'}
        </button>
      </div>
    </div>
  );
}

export default AuthModal;