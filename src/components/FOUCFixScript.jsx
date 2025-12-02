'use client';

import { useEffect } from 'react';

export default function FOUCFixScript() {
  useEffect(() => {
    // Функция для загрузки стилей
    function loadStyles() {
      // Массив стилей для загрузки
      const stylesheets = [
        '/_next/static/css/app/layout.css',
        '/_next/static/css/app/page.css'
      ];
      
      let loadedCount = 0;
      const totalStyles = stylesheets.length;
      
      function checkAllLoaded() {
        loadedCount++;
        if (loadedCount === totalStyles) {
          document.body.classList.remove('styles-loading');
          document.body.classList.add('styles-loaded');
          
          // Сохраняем в sessionStorage что стили загружены
          sessionStorage.setItem('stylesLoaded', 'true');
        }
      }
      
      // Загружаем каждый файл стилей
      stylesheets.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = checkAllLoaded;
        link.onerror = checkAllLoaded; // Даже если ошибка, продолжаем
        document.head.appendChild(link);
      });
    }
    
    // Если стили уже были загружены в этой сессии
    if (sessionStorage.getItem('stylesLoaded') === 'true') {
      document.body.classList.remove('styles-loading');
      document.body.classList.add('styles-loaded');
      return;
    }
    
    // Запускаем когда DOM загружен
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadStyles);
    } else {
      loadStyles();
    }
    
    // Fallback таймаут на случай проблем
    const fallbackTimeout = setTimeout(() => {
      document.body.classList.remove('styles-loading');
      document.body.classList.add('styles-loaded');
      sessionStorage.setItem('stylesLoaded', 'true');
    }, 3000);
    
    // Приоритетная загрузка критических изображений
    const criticalImages = [
      '/icons/img.jpg',
      '/og-image.jpg'
    ];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    
    // Предзагрузка важных страниц
    const prefetchPages = ['/cars', '/about', '/contact'];
    if ('connection' in navigator && navigator.connection.saveData) {
      // Не префетчим если экономим трафик
      return () => clearTimeout(fallbackTimeout);
    }
    
    const prefetchTimeout = setTimeout(() => {
      prefetchPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        link.as = 'document';
        document.head.appendChild(link);
      });
    }, 1000);
    
    return () => {
      clearTimeout(fallbackTimeout);
      clearTimeout(prefetchTimeout);
    };
  }, []);

  return null;
}