'use client';

import { useTranslations } from "next-intl";
import '@/styles/home/compoments/storeLocation.css'
export default function StoreLocation() {
  const address = 'Г.Бельцы ул.Аэродромная 1';
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
const t = useTranslations('Main')
  return (
    <>
    <h3 style={{display:'flex',alignItems:'center',fontSize:"2rem",justifyContent:"center",marginTop:'140px'}}>{t("position")}</h3>
    <div style={{ width: '100%',  marginTop:'120px',marginBottom:'140px' }}>
      <iframe
        src={mapSrc}
        width="100%"
        height="733"
        allowFullScreen=""
        loading="lazy"
        title="Store Location"
      ></iframe>
    </div>
    </>
  );
}
