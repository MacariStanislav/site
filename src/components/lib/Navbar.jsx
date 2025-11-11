'use client';

import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (lang) => {
    const segments = pathname.split('/');
    if (segments.length > 1 && ['en', 'ru', 'ro'].includes(segments[1])) {
      segments[1] = lang;
    } else {
      segments.splice(1, 0, lang);
    }
    
    const newPath = segments.join('/') || '/';
    router.push(newPath);
  };

  // Чтобы избежать гидрации, не рендерим до монтирования
  if (!mounted) {
    return (
      <nav style={{ padding: '12px 24px', backgroundColor: '#111', height: '60px' }}>
        {/* Пустой навар при первой загрузке */}
      </nav>
    );
  }

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: '#111',
        color: '#fff'
      }}
    >
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
        {t('title')}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {['en', 'ru', 'ro'].map((lang) => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            style={{
              backgroundColor: locale === lang ? '#0070f3' : '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: 'pointer'
            }}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  );
}