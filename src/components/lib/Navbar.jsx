'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState('ru'); 
  const t = useTranslations('Navbar');
  const router = useRouter();

  
  useEffect(() => {
    const saved = localStorage.getItem('locale') || 'ru';
    setLocale(saved);

    const segments = window.location.pathname.split('/');

   
    if (segments.length > 1 && ['en', 'ru', 'ro'].includes(segments[1])) {
      if (segments[1] !== saved) {
        segments[1] = saved;
        router.replace(segments.join('/') || '/', { scroll: false });
      }
    } else {

      segments.splice(1, 0, saved);
      router.replace(segments.join('/') || '/', { scroll: false });
    }

    setMounted(true);

  }, []); 

  const changeLanguage = (lang) => {
    if (lang === locale) return;

    setLocale(lang);
    localStorage.setItem('locale', lang); 

    const segments = window.location.pathname.split('/');
    if (segments.length > 1 && ['en','ru','ro'].includes(segments[1])) {
      segments[1] = lang;
    } else {
      segments.splice(1, 0, lang);
    }

    router.replace(segments.join('/') || '/', { scroll: false });
  };

  if (!mounted) {
    return (
      <nav style={{ padding:'12px 24px', backgroundColor:'#111', height:'60px' }}>
       
      </nav>
    );
  }

  return (
    <nav
      style={{
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
        padding:'12px 24px',
        backgroundColor:'#111',
        color:'#fff'
      }}
    >
      <div style={{ fontSize:'20px', fontWeight:'bold' }}>
        {t('title')}
      </div>

      <div style={{ display:'flex', gap:'10px' }}>
        {['en','ru','ro'].map((lang) => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            style={{
              backgroundColor: locale === lang ? '#0070f3' : '#333',
              color:'#fff',
              border:'none',
              borderRadius:'6px',
              padding:'6px 12px',
              cursor:'pointer'
            }}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  );
}
