'use client';

import { useEffect, useState } from 'react';
import CarCard from './CarCard';
import '@/styles/cars/carList.css';
import { fetchCars } from '../../utils/carsApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function CarsList() {
  const [filteredCars, setFilteredCars] = useState([]);
  const [page, setPage] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const t = useTranslations('CarCard');

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth <= 480) setVisibleCount(1);
      else if (window.innerWidth <= 768) setVisibleCount(2);
      else if (window.innerWidth <= 1024) setVisibleCount(3);
      else setVisibleCount(4);
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  async function loadCars() {
    try {
      const data = await fetchCars();
      if (Array.isArray(data)) setFilteredCars(data);
      else setFilteredCars([]);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadCars();
  }, []);

  const maxPage = Math.ceil(filteredCars.length / visibleCount) - 1;
  const canGoPrev = page > 0;
  const canGoNext = page < maxPage;
  const displayCars = filteredCars.slice(page * visibleCount, (page + 1) * visibleCount);

  return (
    <div className="car_list_wrapper">
      <h3>{t('ofers')}</h3>
      <div className="car_list_container">
        <button onClick={() => canGoPrev && setPage(prev => prev - 1)} className={`nav_btn left ${!canGoPrev ? 'disabled' : ''}`}>
          <ChevronLeft size={40} />
        </button>

        <div className="car_list">
          {displayCars.map(car => (
            <CarCard key={car.slug} car={car} />
          ))}
        </div>

        <button onClick={() => canGoNext && setPage(prev => prev + 1)} className={`nav_btn right ${!canGoNext ? 'disabled' : ''}`}>
          <ChevronRight size={40} />
        </button>
      </div>

      <Link href={'/cars'} className="all_ofers">{t('all_ofers')}</Link>
    </div>
  );
}
