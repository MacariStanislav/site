'use client';
import '@/styles/cars/pageCar.css'

export default function CarsPage() {
  const name = "AUTOGARANT_NORD"
  return (
    <>
      <div className='baner'>
        <img src="/banerCar.png" alt="" />
        <span>{name}</span>
      </div>

    </>
  );
}
