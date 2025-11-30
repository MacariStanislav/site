'use client'
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import '@/styles/home/main.css';
import brandCar from './cars'
import CarsList from '@/components/ui/CarsList';
import VideoPlayer from '@/components/ui/VideoPlayer'
import StoreLocation from '@/components/ui/StoreLocation'

const Main = () => {
  const t = useTranslations('Main')
  const social = "@autogarant_nord"
  
  return (
    <main className="main-home-page">
     <section className='home-offers-section home-offers-reset'>
        <h3 className='home-offers-title'>{t("our_offers")}</h3>
        <ul className='home-offers-list'>
          <li className='home-offer-item'>
            <div className='home-offers-liner' />
            <div className='home-offer-block'>
              <div className="home-offer-icon-text">
                <img src="/icons/sell.svg" alt={t("sell")} className="home-offer-icon" />
                <span className="home-offer-label">{t("sell")}</span>
              </div>
              <p className="home-offer-description">{t("sell_text")}</p>
            </div>
          </li>
          <li className='home-offer-item'>
            <div className='home-offers-liner' />
            <div className='home-offer-block'>
              <div className="home-offer-icon-text">
                <img src="/icons/bay.svg" alt={t("bay")} className="home-offer-icon" />
                <span className="home-offer-label">{t("bay")}</span>
              </div>
              <p className="home-offer-description">{t("bayl_text")}</p>
            </div>
          </li>
          <li className='home-offer-item'>
            <div className='home-offers-liner' />
            <div className='home-offer-block'>
              <div className="home-offer-icon-text">
                <img src="/icons/credit.svg" alt={t("credit")} className="home-offer-icon" />
                <span className="home-offer-label">{t("credit")}</span>
              </div>
              <p className="home-offer-description">{t("credit_text")}</p>
            </div>
          </li>
        </ul>
      </section>

      <section className='home-brands-section'>
        <h3 className='home-brands-title'>{t('brand')}</h3>
        <ul className='home-brands-list'>
          {Object.entries(brandCar).map(([key, src]) => (
           <Link 
              href={{
                pathname: '/cars',
                query: { brand: key }
              }} 
              key={key} 
              className='home-brand-link'
            >
              <div className='home-brand-img-wrapper'>
                <img src={src} alt={key} className='home-brand-logo' />
              </div>
              <span className='home-brand-name'>{key}</span>
            </Link>
          ))}
        </ul>
      </section>

      <CarsList />
      <VideoPlayer src="/video.MOV" />
      
      <section className='home-socials-section'>
        <h3 className='home-socials-title'>{t("social")}</h3>
        <ul className='home-socials-list'>
          <li className='home-social-item'>
            <a href="https://www.facebook.com/people/AutoGarant-Nord/61581020022134/" target="_blank" rel="noopener noreferrer" className='home-social-link'>
              <img src="/icons/facebox.svg" alt="Facebook" className='home-social-icon' />
              <span className='home-social-username'>{social}</span>
            </a>
          </li>
          <li className='home-social-item'>
            <a href="https://www.tiktok.com/@autogarantnord" target="_blank" rel="noopener noreferrer" className='home-social-link'>
              <img src="/icons/tiktok.svg" alt="TikTok" className='home-social-icon' />
              <span className='home-social-username'>{social}</span>
            </a>
          </li>
          <li className='home-social-item'>
            <a href="https://www.instagram.com/autogarant_nord/" target="_blank" rel="noopener noreferrer" className='home-social-link'>
              <img src="/icons/instagram.svg" alt="Instagram" className='home-social-icon' />
              <span className='home-social-username'>{social}</span>
            </a>
          </li>
        </ul>
      </section>
      
      <StoreLocation/>
    </main>
  )
}

export default Main;