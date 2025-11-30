'use client'

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import '@/styles/home/header.css';

const Header = () => {
    const t = useTranslations('Home');

    const images = ['/slider/car1.png', '/slider/car2.png', '/slider/car3.png'];
    const [index, setIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
        <div className="slider">
            {images.map((src, i) => (
                <img
                    key={i}
                    src={src}
                    className={`slide ${i === index ? 'active' : ''}`}
                    alt={`Car ${i + 1}`}
                />
            ))}
            
            <div className='text-slider'>
                <h1>AUTOGARANT <br /> NORD</h1>
                <p> {t('slider')}</p>
                <Link href={'/cars'} className='link'>{t('auto_catalog')}</Link>
            </div>
            
          

          
            <div className="dots">
                {images.map((_, i) => (
                    <button
                        key={i}
                        className={`dot ${i === index ? 'active' : ''}`}
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                    ></button>
                ))}
            </div>
        </div>
    )
}

export default Header