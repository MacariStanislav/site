'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchCarBySlug } from '@/utils/carsApi';
import { Link } from '@/i18n/routing';

export default function CarDetailPage() {
  const params = useParams();
  const slug = params.slug;

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadCar() {
    try {
      const data = await fetchCarBySlug(slug);
      if (!data) {
        setError('Машина с таким идентификатором не найдена.');
        setCar(null);
      } else {
        setCar(data);
        setError('');
      }
    } catch (err) {
      
      setError('Произошла ошибка при загрузке машины.');
      setCar(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (slug) {
      setLoading(true);
      loadCar();
    }
  }, [slug]);

  if (loading) {
    return (
      <div style={{ padding: '40px', color: '#fff' }}>
        Загрузка...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '40px',
          color: '#fff',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <h2 style={{ color: '#ff4d4f' }}>{error}</h2>
        <Link href={'/'}>
          <button
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#4da6ff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Вернуться на базу
          </button>
        </Link>
      </div>
    );
  }

 
  return (
    <div
      style={{
        backgroundColor: '#121212',
        color: '#fff',
        padding: '40px',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>
        {car.brand} {car.model}
      </h1>

      <h2 style={{ color: '#4da6ff', fontSize: '22px', marginBottom: '20px' }}>
        ${car.price}
      </h2>

      {car.mediaUrlVideo && (
        <video
          controls
          style={{
            width: '100%',
            maxWidth: '700px',
            borderRadius: '10px',
            marginBottom: '20px',
          }}
        >
          <source src={car.mediaUrlVideo} type="video/mp4" />
        </video>
      )}

      {car.mediaUrlPhoto && car.mediaUrlPhoto.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '30px',
          }}
        >
          {car.mediaUrlPhoto.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`${car.brand} ${car.model} ${index + 1}`}
              style={{
                width: '220px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
              }}
            />
          ))}
        </div>
      )}

      <div
        style={{
          backgroundColor: '#1e1e1e',
          padding: '20px',
          borderRadius: '12px',
          maxWidth: '700px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        <h3 style={{ marginBottom: '15px', fontSize: '18px', color: '#4da6ff' }}>
          Характеристики
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
          <li><strong>Год выпуска:</strong> {car.yearOfManufacture}</li>
          <li><strong>Тип кузова:</strong> {car.bodyType}</li>
          <li><strong>Пробег:</strong> {car.mileage} км</li>
          <li><strong>Объем двигателя:</strong> {car.engineDisplacement} см³</li>
          <li><strong>Мощность:</strong> {car.power} л.с.</li>
          <li><strong>Новизна:</strong> {car.news}%</li>
          <li><strong>Тип топлива:</strong> {car.fuelType}</li>
          <li><strong>Коробка передач:</strong> {car.gearbox}</li>
          <li><strong>Привод:</strong> {car.drive}</li>
          <li><strong>Цвет:</strong> {car.color}</li>
        </ul>

        <Link href={'/'}>
          <button
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#4da6ff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            на базу
          </button>
        </Link>
      </div>
    </div>
  );
}
