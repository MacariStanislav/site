'use client';

import { useEffect, useState } from 'react';
import CarCard from '@/components/ui/CarCard';
import { fetchCars } from '@/utils/carsApi';
import Link from 'next/link';

export default function Home() {
  const [cars, setCars] = useState([]);

  async function loadCars() {
    try {

      const data = await fetchCars();

      if (Array.isArray(data)) {
        setCars(data);
      } else {
        setCars([]);
      }
    } catch (err) {

    }

  }
  useEffect(() => {

    loadCars();

  }, []);

  return (
    <>
      <Link href={'/admin'}>
        <button >admin</button>
      </Link>
      <Link href={'/cars'}>
        <button >filter</button>
      </Link>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' ,marginLeft:'200px'}}>
        {cars.length > 0 ? (
          cars.map(car => <CarCard key={car._id} car={car} />)
        ) : (
          <p>No cars found</p>
        )}
      </div>
    
    </>
  );
}
