'use client';

import { Link } from '@/i18n/routing.js';
import '@/styles/cars/cardCar.css';
import { useTranslations } from 'next-intl';
export default function CarCard({ car }) {
  const t = useTranslations('CarCard')
  return (
    <div className="carCard">
      <div className="carCard_imgBox">
        <img src={car.mediaUrlPhoto[0]} alt={`${car.brand} ${car.model}`} />
      </div>

      <h2 className="carCard_title">
        {car.brand} {car.model}
      </h2>

      <h3 className="carCard_price">
        {car.price}€
      </h3>

      <div className="carCard_info">
        <p> {car.fuelType}</p>
        <p className='right'> {car.yearOfManufacture}</p>

        <p > {car.gearbox}</p>
        <p className='right'> {car.mileage}км</p>
      </div>

  
        <Link href={`/cars/${car.slug}`}>
          <button className="carCard_btn">{t('more_details')}</button>
        </Link>
   
    </div>
  );
}
