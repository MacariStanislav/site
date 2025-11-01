'use client';

import { useEffect, useState } from 'react';
import CarCard from './CarCard';
import Filter from './Filter';
import { fetchCars } from '../utils/carsApi';

export default function CarsList({ limit }) {
  const [cars, setCars] = useState([]); 
  const [filteredCars, setFilteredCars] = useState([]);
  const [brandFilter, setBrandFilter] = useState(''); 
  const [maxPrice, setMaxPrice] = useState(''); 
   
 async function loadCars(){
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
  }, [brandFilter, maxPrice, cars]);

  
  const displayCars = limit ? filteredCars.slice(0, limit) : filteredCars;

 
  return (
    <div>
      <Filter
        brandFilter={brandFilter}
        setBrandFilter={setBrandFilter}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {Array.isArray(displayCars) && displayCars.length > 0 ? (
          displayCars.map(car => <CarCard key={car.slug} car={car} />)
        ) : (
          <p>No cars found</p>
        )}
      </div>
    </div>
  );
}

