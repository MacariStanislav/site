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
    <main>
      <section className='ofers'>
        <h3>{t("our_offers")}</h3>
        <ul>
          <li>
            <div className='liner' />
            <div className='ofers_block'>
              <img src="/icons/sell.svg" alt="" /><span>{t("sell")}</span>
              <p>{t("sell_text")}</p>
            </div>
          </li>
          <li>
            <div className='liner' />
            <div className='ofers_block'>
              <img src="/icons/bay.svg" alt="" /><span>{t("bay")}</span>
              <p>{t("bayl_text")}</p>
            </div>
          </li>
          <li>
            <div className='liner' /> 
            <div className='ofers_block'>
              <img src="/icons/credit.svg" alt="" /><span>{t("credit")}</span>
              <p>{t("credit_text")}</p>
            </div>
          </li>
        </ul>
      </section>

      <section className='car_marc'>
        <h3>{t('brand')}</h3>
        <ul>
          {Object.entries(brandCar).map(([key, src]) => {


            return (
              <Link href={'/cars'} key={key} className='linkCars'>
                <div className='imgWrapper'>
                  <img src={src} alt={key} />
                </div>
                <span>{key}</span>
              </Link>
            );
          })}
        </ul>
      </section>


      <CarsList />
      <VideoPlayer src="/video.mp4" />
      <section className='socials'>
        <h3>{t("social")}</h3>
        <ul>
          <li><a href="https://www.facebook.com/people/AutoGarant-Nord/61581020022134/" target="_blank" rel="noopener noreferrer">
            <img src="/icons/facebox.svg" alt="" /><span>{social}</span>
          </a>
          </li>
          <li>
            <a href="https://www.tiktok.com/@autogarantnord" target="_blank" rel="noopener noreferrer">
              <img src="/icons/tiktok.svg" alt="" /><span>{social}</span></a>
          </li>
          <li>
            <a href="https://www.instagram.com/autogarant_nord/" target="_blank" rel="noopener noreferrer">
              <img src="/icons/instagram.svg" alt="" /><span>{social}</span>
            </a>
          </li>
        </ul>
      </section>
          <StoreLocation/>
    </main>
  )
}

export default Main;
