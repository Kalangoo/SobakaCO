import React from 'react';
import { auth } from '../firebaseConfig'; // To check if the viewer is the poster

function PetDetail({ report }) {
  const handleChat = () => {
    // This is a complex feature. For now, we'll just log it.
    // In a full implementation, this would open a chat window component
    // and create a chat document in Firestore between the two users for this pet.
    console.log(`Starting chat with ${report.reporterEmail} about pet ${report.id}`);
    alert("Chat feature is under development! Contact at: " + report.reporterEmail);
  };

  const isMyReport = auth.currentUser?.uid === report.reporterId;

  return (
    <div className="pet-detail">
      <img src={report.imageUrl} alt={report.name || 'Pet'} width="150" />
      <h3>{report.name || 'Unnamed Pet'} ({report.status})</h3>
      <p><strong>Raça:</strong> {report.breed}</p>
      <p><strong>Characterísticas:</strong> {report.features}</p>
      <p><strong>Machucados:</strong> {report.hasInjuries}</p>
      <p><strong>última vez visto</strong> {report.lastSeenTime.toDate().toLocaleString()}</p>
      {!isMyReport && <button onClick={handleChat}>Contato</button>}
    </div>
  );
}

export default PetDetail;