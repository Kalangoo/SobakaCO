import React, { useState, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebaseConfig';

function ReportForm({ onClose }) {
  const [formData, setFormData] = useState({
    status: 'Lost', // 'Lost' or 'Found'
    name: '',
    breed: '',
    features: '',
    hasInjuries: 'No',
    lastSeenTime: '',
  });
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const autocompleteRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      setLocation({
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location || !image) {
      alert('Please fill in the location and upload an image.');
      return;
    }

    try {
      // 1. Upload image to Firebase Storage
      const imageRef = ref(storage, `petImages/${image.name + Date.now()}`);
      const snapshot = await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // 2. Add report to Firestore
      await addDoc(collection(db, 'petReports'), {
        ...formData,
        location,
        imageUrl,
        lastSeenTime: new Date(formData.lastSeenTime),
        createdAt: serverTimestamp(),
        reporterId: auth.currentUser.uid,
        reporterEmail: auth.currentUser.email,
      });

      alert('Report submitted successfully!');
      onClose();
    } catch (error) {
      console.error("Error submitting report: ", error);
      alert('Failed to submit report.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Report a Pet</h2>
        <form onSubmit={handleSubmit}>
            {/* ... Form fields for name, breed, features etc. */}
            <input type="file" onChange={handleImageChange} required />
            <Autocomplete
                onLoad={(ref) => (autocompleteRef.current = ref)}
                onPlaceChanged={handlePlaceChanged}
            >
                <input type="text" placeholder="Last Seen Location" required />
            </Autocomplete>
            {/* ... other fields */}
            <button type="submit">Submit Report</button>
            <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
}

export default ReportForm;

// NOTE: You would add more form fields (name, breed, features, injuries, time)
// using the same pattern as the handleChange function. This is a simplified example.