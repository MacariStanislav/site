'use client'
import React from 'react'
import "@/styles/footer.css"
import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('Footer')

  return (
   <footer>
    <ul>
      <li className='contact'>
        <h3>AUTOGARANT_NORD</h3>
        <p>{t("locatin")}</p>
        <span>📞 079 705 579</span>
        <span>📞 069 234 242</span>
      </li>

      <li className='grafic'>
        <p className='graf'>{t("grafic")}</p>
        <p style={{marginTop:'2rem'}}>{t("all_time")} 9:00 - 17:00</p>
      </li>

      <li className='social'>
        <p>{t("social")}</p>
        <div>
          <a href="https://www.facebook.com/people/AutoGarant-Nord/61581020022134/" target="_blank" rel="noopener noreferrer">
            <img src="/icons/facebox.svg" alt="Facebook" />
          </a>
          <a href="https://www.tiktok.com/@autogarantnord" target="_blank" rel="noopener noreferrer">
            <img src="/icons/tiktok.svg" alt="TikTok" />
          </a>
          <a href="https://www.instagram.com/autogarant_nord/" target="_blank" rel="noopener noreferrer">
            <img src="/icons/instagram.svg" alt="Instagram" />
          </a>
        </div>
      </li>
    </ul>
   </footer>
  )
}
