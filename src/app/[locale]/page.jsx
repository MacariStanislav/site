'use client';

import { useEffect, useState } from 'react';
import CarCard from '../../components/ui/CarCard';
import { fetchCars } from '../../utils/carsApi';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing.js';

export default function Home() {
  const [cars, setCars] = useState([]);
  const t = useTranslations('Home');
 
  async function loadCars() {
    try {
      const data = await fetchCars();
      if (Array.isArray(data)) {
        setCars(data);
      } else {
        setCars([]);
      }
    } catch (err) {
      console.error('Error loading cars:', err);
    }
  }

  useEffect(() => {
    loadCars();
  }, []);


  return (
    <>
    
      <Link href={'/admin'}>
        <button>admin</button>
      </Link>
      <Link href={'/cars'}>
        <button>filter</button>
      </Link>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginLeft: '200px' }}>
        {cars.length > 0 ? (
          cars.map(car => <CarCard key={car._id} car={car} />)
        ) : (
          <p>No cars found</p>
        )}
      </div>
    
      <h1>{t('description')}</h1>
    </>
  );
}