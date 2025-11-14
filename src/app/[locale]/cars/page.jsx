'use client';

import { Link } from '@/i18n/routing';
import CarsList from '@/components/ui/CarList';
  
export default function CarsPage() {
  return (
    <>
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>All Cars</h1>
      <CarsList limit={2}/>
    </div>
       <Link href={'/'}>
        <button >home</button>
      </Link>
    </>
  );
}
