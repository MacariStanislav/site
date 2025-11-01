'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AdminPage() {
  const [cars, setCars] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [video, setVideo] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');

  const adminPassword = '1234';

 
  const fetchCars = async () => {
    try {
      const res = await api.get('/cars');
      setCars(res.data);
    } catch (err) {
    
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== adminPassword) {
      setMessage('Incorrect password');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);

      if (video) formData.append('mediaUrlVideo', video);
      photos.forEach((photo) => formData.append('mediaUrlPhoto', photo));

      await api.post('/cars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Car added successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setVideo(null);
      setPhotos([]);
      fetchCars();
    } catch (err) {
    
      setMessage('Failed to add car');
    }
  };

 
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    try {
      await api.delete('/cars', { data: { id } });
      fetchCars();
    } catch (err) {
     
      setMessage('Failed to delete car');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Admin Panel - Add Car</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}
      >
        <input
          type="text"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Car Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label>Upload Video (one only)</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        {video && (
          <div>
            <span>{video.name}</span>
            <button type="button" onClick={() => setVideo(null)}>Remove</button>
          </div>
        )}

        <label>Upload Photos (multiple)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setPhotos((prev) => [...prev, ...Array.from(e.target.files)])}
        />
        {photos.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {photos.map((photo, index) => (
              <div key={index}>
                {photo.name}{' '}
                <button
                  type="button"
                  onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit">Add Car</button>
      </form>

      {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}

      <h2 style={{ marginTop: '30px' }}>All Cars</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {cars.map((car) => (
          <div
            key={car._id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong>{car.name}</strong> - ${car.price}
            </div>
            <div>
              <button
                onClick={() => handleDelete(car._id)}
                style={{
                  backgroundColor: 'red',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
