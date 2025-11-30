'use client';

import '@/styles/home/about.css'
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export default function About() {
  const t = useTranslations('About')
  const [activeSlide, setActiveSlide] = useState(1);

  const slides = [
    {
      img: "/about/sell.png",
      title: t('sell'),
      text: t('sell_text')
    },
    {
      img: "/about/bay.png", 
      title: t('buy'),
      text: t('buy_text')
    },
    {
      img: "/about/credit.png",
      title: t('credit'),
      text: t('credit_text')
    }
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };


  const getVisibleSlides = () => {
    const indices = [];
    for (let i = -1; i <= 1; i++) {
      const index = (activeSlide + i + slides.length) % slides.length;
      indices.push(index);
    }
    return indices;
  };

  return (
    <>
      <img src="/about/about.png" alt="" className='head' />
      <div className='text-head'>
        <h1>{t('title')}</h1>
        <p>{t('company_description')}</p>
      </div>

      <section className='ofers desktop-only'>
        <h3>{t('our_services')}</h3>
        <div className='line'></div>
        <ul className='ofers-list'>
          {slides.map((slide, index) => (
            <li key={index}>
              <div className="card">
                <img src={slide.img} alt={slide.title} />
              </div>
              <div className="label-block"><span>{slide.title}</span></div>
              <p>{slide.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mobile-carousel">
        <h3>{t('our_services')}</h3>
        <div className='line'></div>
        
        <div className="carousel-container">
        
          
          <div className="carousel-wrapper">
            <div className="carousel-track">
              {getVisibleSlides().map((slideIndex, positionIndex) => (
                <div 
                  key={slideIndex}
                  className={`carousel-item ${
                    positionIndex === 1 ? 'active' : 
                    positionIndex === 0 ? 'left' : 'right'
                  }`}
                  onClick={() => {
                    if (positionIndex === 0) prevSlide();
                    if (positionIndex === 2) nextSlide();
                  }}
                >
                 <div className='border'> <div className="card">
                    <img src={slides[slideIndex].img} alt={slides[slideIndex].title} />
                  </div>
                  <div className="label-block"><span>{slides[slideIndex].title}</span></div>
                 </div>
                  <p>{slides[slideIndex].text}</p>
                </div>
              ))}
            </div>
          </div>

        
        </div>
        
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <span 
              key={index}
              className={`carousel-dot ${index === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(index)}
            ></span>
          ))}
        </div>
      </section>

      <section className="stats">
        <ul className="stats-list">
          <li>
            <h3>5K+</h3>
            <p>{t('sold_cars')}</p>
          </li>
          <li>
            <h3>20K+</h3>
            <p>{t('satisfied_clients')}</p>
          </li>
          <li>
            <h3>250+</h3>
            <p>{t('models_in_stock')}</p>
          </li>
          <li>
            <h3>100%</h3>
            <p>{t('reliability_guarantee')}</p>
          </li>
        </ul>
      </section>

      <section className="about-grid">
        <div className="text-block">{t('text_block_1')}</div>
        <img src="/lines/line1.svg" className="grid-line line-1" alt="" />
        <img src="/lines/line2.svg" className="grid-line line-2" alt="" />
        <div className="text-block">{t('text_block_2')}</div>
        <div className="text-block">{t('text_block_3')}</div>
        <img src="/lines/line3.svg" className="grid-line line-3" alt="" />
        <div></div>
        <div className="text-block">{t('text_block_4')}</div>
        <div className="text-block">{t('text_block_5')}</div>
        <img src="/lines/line4.svg" className="grid-line line-4" alt="" />
      </section>
    </>
  );
}