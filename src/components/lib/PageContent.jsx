'use client';
import { usePathname } from 'next/navigation';

export default function PageContent({ children }) {
  const pathname = usePathname();
  const isHome = pathname === '/ru' || pathname === '/ro';

  return <div style={{ marginTop: isHome ? 0 : '80px' }}>{children}</div>;
}
