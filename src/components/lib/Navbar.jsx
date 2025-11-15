'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {Link} from '@/i18n/routing';

export default function Navbar() {

  const [locale, setLocale] = useState('ru');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const t = useTranslations('Navbar');
  const router = useRouter();
  const locales = ['en', 'ru', 'ro'];

  useEffect(() => {
    const saved = localStorage.getItem('locale') || 'ru';
    setLocale(saved);

    const segments = window.location.pathname.split('/');

    if (segments.length > 1 && locales.includes(segments[1])) {
      if (segments[1] !== saved) {
        segments[1] = saved;
        router.replace(segments.join('/') || '/', { scroll: false });
      }
    } else {
      segments.splice(1, 0, saved);
      router.replace(segments.join('/') || '/', { scroll: false });
    }
  }, []);

  useEffect(() => {
    function outsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', outsideClick);
    return () => document.removeEventListener('mousedown', outsideClick);
  }, []);

  const changeLanguage = (lang) => {
    if (lang === locale) {
      setOpen(false);
      return;
    }

    setLocale(lang);
    localStorage.setItem('locale', lang);

    const segments = window.location.pathname.split('/');
    if (segments.length > 1 && locales.includes(segments[1])) {
      segments[1] = lang;
    } else {
      segments.splice(1, 0, lang);
    }

    router.replace(segments.join('/') || '/', { scroll: false });
    setOpen(false);
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        padding: "12px 20px",
        background: "#0b0b0d",
        color: "#fff"
      }}
    >
      {/* <img src="" alt="" /> */}

      <ul style={{
        display: "flex",
        gap: "18px",
        listStyle: "none",
        margin: 0,
        padding: 0,
        flex: 1
      }}>
        <li><Link href={'/'}>{t('home')}</Link></li>
        <li><Link href={'/'}>{t('catalog')}</Link></li>
        <li><Link href={'/'}>{t('about_us')}</Link></li>
        <li>+ 373 797 055 79</li>
      </ul>

      {/* ---------------- DROPDOWN ---------------- */}
      <div ref={dropdownRef} style={{ position: "relative" }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 10px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "10px",
            cursor: "pointer",
            userSelect: "none"
          }}
        >
          <img
            src={`/flags/${locale}.png`}
            style={{ width: "20px", height: "14px", borderRadius: "2px" }}
          />
          <span style={{ fontSize: "13px", fontWeight: "600" }}>
            {locale.toUpperCase()}
          </span>
          <span style={{ fontSize: "12px", opacity: 0.8 }}>▾</span>
        </div>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: 0,
              background: "#101214",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px",
              padding: "8px",
              minWidth: "140px",
              zIndex: 999
            }}
          >
            {locales.map((lang) => (
              <div
                key={lang}
                onClick={() => changeLanguage(lang)}
               
              >
               
                <span>{lang.toUpperCase()}</span>
                {lang === locale && (
                  <span >+</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
   

    </nav>
  );
}
