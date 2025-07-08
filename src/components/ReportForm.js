import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebaseConfig';
import './Modal.css'; // Importa o CSS compartilhado dos modais

function ReportForm({ onClose }) {
  const [formData, setFormData] = useState({
    status: 'Lost',
    name: '',
    breed: '',
    features: '',
    hasInjuries: 'No',
    lastSeenTime: '',
  });
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Aguardando...');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador.');
      setLocationStatus('Não suportado');
      return;
    }
    setLocationStatus('Obtendo localização...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus('Localização obtida com sucesso!');
        console.log("Localização obtida:", position.coords);
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        setLocationStatus(`Erro: ${error.message}`);
        console.error("Erro ao obter localização: ", error);
        alert(`Não foi possível obter a localização. Erro: ${error.message}`);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location || !image) {
      alert('Por favor, obtenha sua localização e envie uma imagem.');
      return;
    }
    try {
      const imageRef = ref(storage, `petImages/${image.name + Date.now()}`);
      const snapshot = await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'petReports'), {
        ...formData,
        location,
        imageUrl,
        // Corrigido para só adicionar a data se ela for válida
        ...(formData.lastSeenTime && { lastSeenTime: new Date(formData.lastSeenTime) }),
        createdAt: serverTimestamp(),
        reporterId: auth.currentUser.uid,
        reporterEmail: auth.currentUser.email,
      });

      alert('Relatório enviado com sucesso!');
      onClose();
    } catch (error) {
      console.error("!!! ERRO CAPTURADO NO HANDLE SUBMIT (ReportForm) !!!");
      console.error("Objeto de Erro Completo:", error);
      alert(`Falha ao enviar o relatório. Verifique o console para mais detalhes.`);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Relatar um Pet</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input type="text" name="name" onChange={handleChange} value={formData.name} placeholder="Nome do animal (opcional)" />
          <input type="text" name="breed" onChange={handleChange} value={formData.breed} placeholder="Raça (opcional)" />
          <input type="text" name="features" onChange={handleChange} value={formData.features} placeholder="Características marcantes" required/>
          
          <select name="hasInjuries" onChange={handleChange} value={formData.hasInjuries}>
            <option value="No">Não parece ter ferimentos</option>
            <option value="Yes">Sim, parece estar ferido</option>
            <option value="Unknown">Não sei</option>
          </select>

          <label htmlFor="lastSeenTime">Visto por último em:</label>
          <input type="datetime-local" id="lastSeenTime" name="lastSeenTime" onChange={handleChange} value={formData.lastSeenTime} />
          
          <input type="file" onChange={handleImageChange} required />
          
          <div style={{ textAlign: 'center', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
            <h4>Localização</h4>
            <button type="button" onClick={handleGetLocation}>Usar minha localização atual</button>
            <p><strong>Status:</strong> {locationStatus}</p>
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="close-button">Fechar</button>
            <button type="submit" className="submit-button">Enviar Relatório</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportForm;