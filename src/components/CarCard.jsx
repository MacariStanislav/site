'use client';

import Link from 'next/link';

export default function CarCard({ car }) {
  console.log(car)
  return (
    <div
      style={{
        backgroundColor: '#1a1a1a',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
        width: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
 
      {car.mediaUrlPhoto && car.mediaUrlPhoto.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            borderRadius: '8px',
          }}
        >
          {car.mediaUrlPhoto.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`${car.name} ${index + 1}`}
              style={{
                width: '100%',
                height: '180px',
                objectFit: 'cover',
                borderRadius: '8px',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}


      {car.mediaUrlVideo && (
        <video
          controls
          style={{
            width: '100%',
            height: '180px',
            borderRadius: '8px',
            objectFit: 'cover',
          }}
          src={car.mediaUrlVideo}
        />
      )}

      <h2 style={{ margin: '8px 0', fontSize: '18px', fontWeight: '600' }}>
        {car.brand} {car.model}
      </h2>

      <div style={{ fontSize: '14px', color: '#bbb', lineHeight: '1.4' }}>
        <p>Год: {car.yearOfManufacture}</p>
        <p>Тип кузова: {car.bodyType}</p>
        <p>Пробег: {car.mileage} км</p>
        <p>Объем двигателя: {car.engineDisplacement} см³</p>
        <p>Мощность: {car.power} л.с.</p>
        <p>Новизна: {car.news}</p>
        <p>Топливо: {car.fuelType}</p>
        <p>Коробка: {car.gearbox}</p>
        <p>Привод: {car.drive}</p>
        <p>Цвет: {car.color}</p>
      </div>

      <h3 style={{ margin: '10px 0 0', color: '#4da6ff', fontSize: '20px' }}>
        ${car.price}
      </h3>

      {car.slug && (
        <Link href={`/cars/${car.slug}`}>
          <button
            style={{
              marginTop: '12px',
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#0070f3',
              color: '#fff',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              width: '100%',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#0059c1')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#0070f3')}
          >
            Детали
          </button>
        </Link>
      )}
    </div>
  );
}
