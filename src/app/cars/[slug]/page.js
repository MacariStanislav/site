'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchCarBySlug } from '../../../utils/carsApi';

export default function CarDetailPage() {
  const { slug } = useParams();
  const [car, setCar] = useState(null);

  async function loadCar() {
    try {
      const data = await fetchCarBySlug(slug);
     
      setCar(data);
    } catch (err) {
  
    }
  }

  useEffect(() => {
    if (slug) loadCar();
  }, [slug]);

  if (!car) return <p>No car data</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>{car.name}</h1>
      <p>{car.description}</p>
      <p><strong>Price:</strong> ${car.price}</p>

    
      {car.mediaUrlVideo && (
        <video width="400" controls style={{ marginBottom: '10px' }}>
          <source src={car.mediaUrlVideo} type="video/mp4" />
        </video>
      )}

    
      {car.mediaUrlPhoto &&  (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {car.mediaUrlPhoto.map((photo, index) => (
            <img
              key={index}
              src={photo}
              
              width="200"
              style={{ borderRadius: '6px', objectFit: 'cover' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
