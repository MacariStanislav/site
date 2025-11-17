'use client'

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import '@/styles/home/header.css';

const Header = () => {
    const t = useTranslations('Home');

    const images = ['/slider/bmw.png', '/slider/bmw1.png', '/slider/bmw2.png', '/slider/image.png'];
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
                <p> Creating a design for brands and involving people who interact with them is one of the main goals of our company</p>
                <Link href={'/cars'} className='link'>{t('auto_catalog')}</Link>
            </div>
            
            {!isMobile && (
                <>
                    <div className="arrow left" onClick={prev}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="arrow right" onClick={next}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </>
            )}

            {isMobile && (
                <>
                    <button className="mobile-arrow left" onClick={prev} aria-label="Previous slide">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <button className="mobile-arrow right" onClick={next} aria-label="Next slide">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </>
            )}

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