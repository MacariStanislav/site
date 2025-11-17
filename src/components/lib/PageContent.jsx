'use client';
import { usePathname } from 'next/navigation';
import '@/styles/pageContent.css'
export default function PageContent({ children }) {
  const pathname = usePathname();
  const isHome = pathname === '/ru' || pathname === '/ro';

  return <div className={`${isHome ? "": "isHome" }`}>{children}</div>;
}
