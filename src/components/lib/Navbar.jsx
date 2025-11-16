'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';
import '@/styles/navbar.css';
export default function Navbar({ pathname }) {
  const t = useTranslations('Navbar');
  const router = useRouter();
  const locales = ['ru', 'ro'];

  const [locale, setLocale] = useState('ru');
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const isHome = pathname === '/ru' || pathname === '/ro';
  const currentPath = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 180);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

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

  const getNavClass = () => {
    if (!isHome) return 'nav-red';
    return isScrolled ? 'nav-red' : 'nav-transparent';
  };

  return (
    <nav className={getNavClass()}>
      <Link href="/"><img src="/AG.svg" alt="logo" className="logo" /></Link>
      
      <ul>
        <li><Link href="/">{t('home')}</Link></li>
        <li><Link href="/cars">{t('catalog')}</Link></li>
        <li><Link href="/">{t('about_us')}</Link></li>
        <li>+ 373 797 055 79</li>
      </ul>
      <div
        ref={dropdownRef}
        className={`wd-event-click dropdown`}
        onClick={() => setOpen(!open)}
      >
        <div className="dropdownBlock">
          <img src={`/flags/${locale}.svg`} alt="" />
          <span>{locale.toUpperCase()}</span>
        </div>
        <div className={`wd-dropdown wd-dropdown-menu wd-design-default ${open ? 'wd-opened' : ''}`}>
          {locales.filter((l) => l !== locale).map((lang) => (
            <div key={lang} className="dropdownItem" onClick={() => changeLanguage(lang)}>
              <img src={`/flags/${lang}.svg`} alt="" />
              <span>{lang.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
