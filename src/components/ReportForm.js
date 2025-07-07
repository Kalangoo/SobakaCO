import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebaseConfig';
// Não precisamos mais do Map, Marker ou Geocoder aqui

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
  // O estado 'location' agora será preenchido pelo botão
  const [location, setLocation] = useState(null); 
  const [locationStatus, setLocationStatus] = useState('Aguardando...'); // Para dar feedback ao usuário

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // --- NOVA FUNÇÃO PARA OBTER A LOCALIZAÇÃO ---
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
          // Não precisamos do endereço aqui, apenas lat/lng
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

  // --- FUNÇÃO DE SUBMISSÃO ATUALIZADA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    // A verificação agora é mais simples
    if (!location || !image) {
      alert('Por favor, obtenha sua localização e envie uma imagem.');
      return;
    }
    
    // O resto da lógica de upload e salvamento é a mesma
    try {
      // 1. Upload da imagem
      const imageRef = ref(storage, `petImages/${image.name + Date.now()}`);
      const snapshot = await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // 2. Adicionar o relatório ao Firestore
      console.log("Salvando no Firestore com estes dados:", { ...formData, location, imageUrl });
      await addDoc(collection(db, 'petReports'), {
        ...formData,
        location, // O objeto de localização obtido do navegador
        imageUrl,
// Se o campo lastSeenTime foi preenchido, crie a data. Senão, não adicione o campo.
lastSeenTime: new Date(formData.lastSeenTime),
        reporterId: auth.currentUser.uid,
        reporterEmail: auth.currentUser.email,
      });

      alert('Relatório enviado com sucesso!');
      onClose();
    } catch (error) {
      // --- NOVAS LINHAS DE DEPURAÇÃO ---
console.error("!!! ERRO CAPTURADO NO HANDLE SUBMIT !!!");
console.error("Tipo do Erro:", error.name);
console.error("Mensagem do Erro:", error.message);
console.error("Código do Erro (se houver):", error.code);
console.error("Objeto de Erro Completo:", error); // A linha mais importante!
alert(`Falha ao enviar o relatório. Verifique o console para mais detalhes.`);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Relatar um Pet</h2>
        <form onSubmit={handleSubmit}>
          {/* Adicione aqui os outros campos do formulário (nome, raça, etc.) */}
          <input 
            type="text" 
            name="name" 
            placeholder="Nome do animal (se souber)"
            onChange={handleChange} 
          />
          {/* ...outros inputs... */}
          <input type="file" onChange={handleImageChange} required />
          <label htmlFor="lastSeenTime">Visto por último em:</label>
<input
  type="datetime-local" // Este é um tipo de input especial para data e hora
  id="lastSeenTime"
  name="lastSeenTime"
  onChange={handleChange}
  required // Torna o campo obrigatório, evitando o erro
/>

          <hr />

          {/* --- NOVA SEÇÃO DE LOCALIZAÇÃO --- */}
          <div>
            <h4>Localização</h4>
            <p>Clique no botão para usar sua localização atual como o local onde o animal foi visto.</p>
            <button type="button" onClick={handleGetLocation}>
              Usar minha localização atual
            </button>
            <p><strong>Status:</strong> {locationStatus}</p>
            {location && (
                <p style={{color: 'green'}}>✓ Coordenadas salvas!</p>
            )}
          </div>

          <hr />
          
          <button type="submit">Enviar Relatório</button>
          <button type="button" onClick={onClose}>Fechar</button>
        </form>
      </div>
    </div>
  );
}

export default ReportForm;