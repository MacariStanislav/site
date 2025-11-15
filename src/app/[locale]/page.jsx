'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import '@/styles/homePage.css';

export default function Home() {
  const t = useTranslations('Home');

  const images = ['/slider/bmw.png', '/slider/bmw1.png', '/slider/bmw2.png', '/slider/image.png'];
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => {
    setIndex(i);
    startTimer();
  };
  const prev = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    startTimer();
  };
  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
    startTimer();
  };

  return (
    <>
      <div className="slider">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            className={`slide ${i === index ? 'active' : ''}`}
          />
        ))}
        <div className='text-slider'>
<h1 >AUTOGARANT <br/> NORD</h1>
        <p>Creating a design for brands and involving people who interact
          with them is one of the main goals of our company</p>
        <Link href={'/cars'}>Каталог Автомобилей</Link>
        </div>
        <div className="arrow left" onClick={prev}></div>
        <div className="arrow right" onClick={next}></div>
        
        <div className="dots">
          {images.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === index ? 'active' : ''}`}
              onClick={() => goTo(i)}
            ></div>
          ))}
        </div>
      </div>


    </>
  );
}
