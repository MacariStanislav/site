'use client';

import Link from 'next/link';
import CarsList from '../../components/CarList';

export default function CarsPage() {
  return (
    <>
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>All Cars</h1>
      <CarsList />
    </div>
       <Link href={'/'}>
        <button >home</button>
      </Link>
    </>
  );
}
