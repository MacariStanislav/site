'use client';

import { useEffect, useState } from 'react';
import CarCard from '../../components/ui/CarCard';
import { fetchCars } from '../../utils/carsApi';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link'; // ← Обычный Next.js Link
import { useRouter } from 'next/navigation'; // ← Обычный Next.js useRouter

export default function Home() {
  const [cars, setCars] = useState([]);
  const t = useTranslations('Home');
  const locale = useLocale();
  const router = useRouter();

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

  // Функция для переходов с сохранением локали
  const navigateWithLocale = (path) => {
    return `/${locale}${path}`;
  };

  return (
    <>
      {/* Используем обычный Link с добавлением локали */}
      <Link href={navigateWithLocale('/admin')}>
        <button>admin</button>
      </Link>
      <Link href={navigateWithLocale('/cars')}>
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