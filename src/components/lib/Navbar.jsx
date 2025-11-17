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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
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
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(e.target) && 
          !e.target.closest('.burger-menu')) {
        setIsMobileMenuOpen(false);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={getNavClass()}>
        <Link href="/">
          <img src="/AG.svg" alt="logo" className="logo" />
        </Link>
        
        <ul className="desktop-nav">
          <li><Link href="/" onClick={handleNavLinkClick}>{t('home')}</Link></li>
          <li><Link href="/cars" onClick={handleNavLinkClick}>{t('catalog')}</Link></li>
          <li><Link href="/about" onClick={handleNavLinkClick}>{t('about_us')}</Link></li>
          <li className="phone-number">+ 373 797 055 79</li>
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

        <button 
          className={`burger-menu ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}></div>

      <div ref={mobileMenuRef} className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-content">
          <Link href="/" onClick={handleNavLinkClick} className="mobile-nav-link">
            {t('home')}
          </Link>
          <Link href="/cars" onClick={handleNavLinkClick} className="mobile-nav-link">
            {t('catalog')}
          </Link>
          <Link href="/about" onClick={handleNavLinkClick} className="mobile-nav-link">
            {t('about_us')}
          </Link>
          <div className="mobile-phone">+ 373 797 055 79</div>
          
          <div className="mobile-language-selector">
            <div className="mobile-language-label">Select Language:</div>
            <div className="mobile-language-buttons">
              {locales.map((lang) => (
                <button
                  key={lang}
                  className={`mobile-language-btn ${locale === lang ? 'active' : ''}`}
                  onClick={() => {
                    changeLanguage(lang);
                    handleNavLinkClick();
                  }}
                >
                  <img src={`/flags/${lang}.svg`} alt={lang} />
                  <span>{lang.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
