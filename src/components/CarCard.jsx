'use client';

import Link from 'next/link';

export default function CarCard({ car }) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        width: '250px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {car.mediaUrl && (
        <img
          src={car.mediaUrl}
          alt={car.name}
          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px' }}
        />
      )}

      <h3 style={{ margin: 0 }}>{car.name}</h3>
      <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>{car.description}</p>
      <p style={{ fontWeight: 'bold', margin: 0 }}>${car.price}</p>

   
      {car.slug && (
        <Link href={`/cars/${car.slug}`}>
          <button
            style={{
              marginTop: '10px',
              padding: '6px 10px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#0070f3',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            View Details
          </button>
        </Link>
      )}
    </div>
  );
}
