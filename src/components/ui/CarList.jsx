'use client';

import { useEffect, useState } from 'react';
import CarCard from './CarCard';
import Filter from './Filter';
import { fetchCars } from '../utils/carsApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CarsList({ limit = 3 }) {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [brandFilter, setBrandFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(0); 

  async function loadCars() {
    try {
      const data = await fetchCars();
      if (Array.isArray(data)) {
        setCars(data);
        setFilteredCars(data);
      } else {
        setCars([]);
        setFilteredCars([]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    let filtered = [...cars];

    if (brandFilter) {
      filtered = filtered.filter(car =>
        car.name.toLowerCase().includes(brandFilter.toLowerCase())
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(car => car.price <= Number(maxPrice));
    }

    setFilteredCars(filtered);
    setPage(0); 
  }, [brandFilter, maxPrice, cars]);


  const startIndex = page * limit;
  const endIndex = startIndex + limit;
  const displayCars = filteredCars.slice(startIndex, endIndex);

  const canGoPrev = page > 0;
  const canGoNext = endIndex < filteredCars.length;

  return (
    <div style={{ position: 'relative' }}>
      <Filter
        brandFilter={brandFilter}
        setBrandFilter={setBrandFilter}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
       
        <button
          onClick={() => setPage(prev => prev - 1)}
          disabled={!canGoPrev}
          style={{
            background: 'none',
            border: 'none',
            cursor: canGoPrev ? 'pointer' : 'not-allowed',
            opacity: canGoPrev ? 1 : 0.3,
          }}
        >
          <ChevronLeft size={36} />
        </button>

   
        <div
          style={{
            display: 'flex',
            gap: '15px',
            overflow: 'hidden',
            width: '600px',
            justifyContent: 'center',
          }}
        >
          {displayCars.length > 0 ? (
            displayCars.map(car => <CarCard key={car.slug} car={car} />)
          ) : (
            <p>No cars found</p>
          )}
        </div>

     
        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={!canGoNext}
          style={{
            background: 'none',
            border: 'none',
            cursor: canGoNext ? 'pointer' : 'not-allowed',
            opacity: canGoNext ? 1 : 0.3,
          }}
        >
          <ChevronRight size={36} />
        </button>
      </div>
    </div>
  );
}


