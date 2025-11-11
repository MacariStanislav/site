'use client';

import { useState, useEffect } from 'react';
import api from '../../../utils/api';

export default function AdminPage() {
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState(null);

  const adminPassword = '1234'; // тестовый пароль

  const [formData, setFormData] = useState({
    price: 0,
    name: '',
    brand: '',
    model: '',
    yearOfManufacture: 0,
    bodyType: '',
    mileage: 0,
    engineDisplacement: 0,
    power: 0,
    news: '',
    fuelType: '',
    gearbox: '',
    drive: '',
    color: '',
  });

  async function fetchCars() {
    try {
      const res = await api.get('/cars');
      setCars(res.data);
    } catch (err) {
   
    }
  }

  useEffect(() => {
    fetchCars();
  }, []);


  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };


  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        setFormData((prev) => ({
          ...prev,
          ...Object.keys(prev).reduce((acc, key) => {
            if (data[key] !== undefined) {
              acc[key] = data[key];
            }
            return acc;
          }, {}),
        }));

        setMessage('JSON успешно загружен и поля заполнены!');
      } catch (err) {
        
        setMessage('неверный формат JSON файла.');
      }
    };
    reader.readAsText(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== adminPassword) {
      setMessage('Неверный пароль');
      return;
    }

    try {
      const data = new FormData();

     
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      photos.forEach((photo) => data.append('mediaUrlPhoto', photo));
      if (video) data.append('mediaUrlVideo', video);

  
      const res = await api.post('/cars', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setCars((prev) => [...prev, res.data]);
      setMessage('Машина добавлена!');

     
      setFormData({
      price: 0,
    name: '',
    brand: '',
    model: '',
    yearOfManufacture: 0,
    bodyType: '',
    mileage: 0,
    engineDisplacement: 0,
    power: 0,
    news: '',
    fuelType: '',
    gearbox: '',
    drive: '',
    color: '',
      });
      setPhotos([]);
      setVideo(null);
      setPassword('');
    } catch (err) {
    
      setMessage('Ошибка при добавлении машины');
    }
  };


  const handleDelete = async (id) => {
    if (!confirm('Удалить эту машину?')) return;
    try {
      await api.delete('/cars', { data: { id } });
      fetchCars();
    } catch (err) {
     
      setMessage('Ошибка при удалении машины');
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
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

    
        <label>Upload JSON File (auto-fill form)</label>
        <input
          type="file"
          accept=".json"
          onChange={handleJsonUpload}
        />
 
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type={['price','mileage','engineDisplacement','power','yearOfManufacture'].includes(key) ? 'number' : 'text'}
            name={key}
            placeholder={key}
            value={formData[key]}
            onChange={handleChange}
          />
        ))}

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

        <button type="submit"> Add Car</button>
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
