'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';

export default function AdminPage() {
  const [adminPassword, setAdminPassword] = useState('');
  const [singleCar, setSingleCar] = useState({
    name: '', brand: '', model: '', yearOfManufacture: 0, bodyType: '',
    mileage: 0, engineDisplacement: 0, power: 0, news: '',
    fuelType: '', gearbox: '', drive: '', color: '', price: 0
  });
  const [singlePhotos, setSinglePhotos] = useState([]);
  const [singleVideo, setSingleVideo] = useState(null);

  const [carsArray, setCarsArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bulkPhotos, setBulkPhotos] = useState([]);
  const [bulkVideo, setBulkVideo] = useState(null);

  const [allCars, setAllCars] = useState([]);
  const [message, setMessage] = useState('');

  const ADMIN_KEY = '1234'; 

  const fetchAllCars = async () => {
    try {
      const res = await api.get('/cars');
      const carsData = Array.isArray(res.data) ? res.data : res.data.cars || [];
      setAllCars(carsData);
    } catch (err) {
      console.error(err);
      setMessage('Ошибка при загрузке машин с сервера');
    }
  };

  useEffect(() => { fetchAllCars(); }, []);

  const handleSingleChange = (e) => {
    const { name, value, type } = e.target;
    setSingleCar(prev => ({
      ...prev,
      [name]: ['price', 'mileage', 'engineDisplacement', 'power', 'yearOfManufacture'].includes(name) ? parseInt(value) || 0 : value
    }));
  };

  const handleSingleSubmit = async () => {
    if (adminPassword !== ADMIN_KEY) { setMessage('Неверный пароль'); return; }
    if (!singlePhotos.length) { setMessage('Добавьте хотя бы одно фото'); return; }

    try {
      const formData = new FormData();
      Object.entries(singleCar).forEach(([k, v]) => formData.append(k, v));
      singlePhotos.forEach(p => formData.append('mediaUrlPhoto', p));
      if (singleVideo) formData.append('mediaUrlVideo', singleVideo);

      const res = await api.post('/cars', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setAllCars(prev => [...prev, res.data]);
      setMessage(`Машина "${singleCar.name}" добавлена`);

      setSingleCar({ name: '', brand: '', model: '', yearOfManufacture: 0, bodyType: '', mileage: 0, engineDisplacement: 0, power: 0, news: '', fuelType: '', gearbox: '', drive: '', color: '', price: 0 });
      setSinglePhotos([]);
      setSingleVideo(null);
    } catch (err) {
      console.error(err);
      setMessage('Ошибка при добавлении машины');
    }
  };

  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!Array.isArray(data)) throw new Error('JSON должен быть массивом');
        setCarsArray(data);
        setCurrentIndex(0);
        setBulkPhotos([]);
        setBulkVideo(null);
        setMessage(`Загружено ${data.length} машин для bulk`);
      } catch {
        setMessage('Неверный формат JSON');
      }
    };
    reader.readAsText(file);
  };

  const handleBulkUploadMedia = async () => {
    if (adminPassword !== ADMIN_KEY) { setMessage('Неверный пароль'); return; }

    const currentCar = carsArray[currentIndex];
    if (!currentCar) return;
    if (!bulkPhotos.length) { setMessage('Добавьте хотя бы одно фото'); return; }

    try {
      const formData = new FormData();
      Object.entries(currentCar).forEach(([k, v]) => formData.append(k, v));
      bulkPhotos.forEach(p => formData.append('mediaUrlPhoto', p));
      if (bulkVideo) formData.append('mediaUrlVideo', bulkVideo);

      const res = await api.post('/cars/bulk', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setAllCars(prev => [...prev, res.data]);
      setMessage(`Машина "${currentCar.name}" добавлена`);

      setBulkPhotos([]);
      setBulkVideo(null);

      if (currentIndex + 1 < carsArray.length) setCurrentIndex(currentIndex + 1);
      else setCarsArray([]);
    } catch (err) {
      console.error(err);
      setMessage('Ошибка при bulk добавлении машины');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить эту машину?')) return;
    try {
      await api.delete('/cars', { data: { id } });
      fetchAllCars();
      setMessage('Машина удалена');
    } catch (err) {
      console.error(err);
      setMessage('Ошибка при удалении машины');
    }
  };

  const currentBulkCar = carsArray[currentIndex];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>

      <div style={{ flexBasis: '100%', marginBottom: '20px' }}>
        <input type="password" placeholder="Пароль администратора" value={adminPassword} onChange={e => setAdminPassword(e.target.value)}
          style={{ padding: '8px', width: '300px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ flex: 1, minWidth: '300px', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2>Добавить одну машину</h2>
        {Object.keys(singleCar).map(key => (
          <input
            key={key} name={key}
            type={['price', 'mileage', 'engineDisplacement', 'power', 'yearOfManufacture'].includes(key) ? 'number' : 'text'}
            placeholder={key} value={singleCar[key]} onChange={handleSingleChange}
            style={{ margin: '5px 0', padding: '6px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        ))}
        <label>Фото (обязательно хотя бы 1)</label>
        <input type="file" accept="image/*" multiple onChange={e => setSinglePhotos([...singlePhotos, ...Array.from(e.target.files)])} />
        {singlePhotos.length > 0 ? <p>{singlePhotos.map((p, i) => `${i}: ${p.name}`).join(', ')}</p> : <p>Фото ещё не выбрано</p>}
        <label>Видео (опционально)</label>
        <input type="file" accept="video/*" onChange={e => setSingleVideo(e.target.files[0])} />
        {singleVideo ? <p>{singleVideo.name}</p> : <p>Видео ещё не выбрано</p>}
        <button onClick={handleSingleSubmit} style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Добавить машину</button>
      </div>

      <div style={{ flex: 1, minWidth: '300px', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2>Добавить несколько машин (Bulk Upload)</h2>
        {!carsArray.length && <input type="file" accept=".json" onChange={handleJsonUpload} />}
        {currentBulkCar && (
          <>
            <h3>{currentIndex + 1}/{carsArray.length}: {currentBulkCar.name}</h3>
            <label>Фото (обязательно хотя бы 1)</label>
            <input type="file" accept="image/*" multiple onChange={e => setBulkPhotos([...bulkPhotos, ...Array.from(e.target.files)])} />
            {bulkPhotos.length > 0 ? <p>{bulkPhotos.map((p, i) => `${i}: ${p.name}`).join(', ')}</p> : <p>Фото ещё не выбрано</p>}
            <label>Видео (опционально)</label>
            <input type="file" accept="video/*" onChange={e => setBulkVideo(e.target.files[0])} />
            {bulkVideo ? <p>{bulkVideo.name}</p> : <p>Видео ещё не выбрано</p>}
            <button onClick={handleBulkUploadMedia} style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {currentIndex + 1 === carsArray.length ? 'Загрузить и закончить' : 'Загрузить и следующая'}
            </button>
          </>
        )}
      </div>

      <div style={{ flexBasis: '100%', marginTop: '30px' }}>
        <h2>Все машины на сервере</h2>
        {allCars.length > 0 ? allCars.map((car, index) => (
          <div key={car._id || car.id || index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '5px' }}>
            <div><strong>{car.name}</strong> - ${car.price}</div>
            <button onClick={() => handleDelete(car._id || car.id)} style={{ backgroundColor: 'red', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>Delete</button>
          </div>
        )) : <p>Нет машин на сервере</p>}
      </div>

      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
    </div>
  );
}
