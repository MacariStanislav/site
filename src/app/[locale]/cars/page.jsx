'use client';
import '@/styles/cars/pageCar.css'
import CarFilter from '@/components/ui/CarFilter'
export default function CarsPage() {
  const name = "AUTOGARANT_NORD"
  return (
    <>
      <dir>
        <img src="/banerCar.png" alt="" className='baner' />
        <span className='baner_text'>{name}</span></dir>
      <CarFilter />

    </>
  );
}
