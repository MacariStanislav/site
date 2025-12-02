'use client';
import '@/styles/cars/carList.css';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { fetchCarBySlug, fetchSimilarCars } from '@/utils/carsApi';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import styles from '@/styles/home/compoments/car-detail.module.css';
import CarsList from '@/components/ui/CarsList';

export default function CarDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const t = useTranslations('CarDetail');

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [similarCars, setSimilarCars] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sliderRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const phoneNumber = '079705579';
  const instagramVideoUrl = 'https://instagram.com/p/VIDEO_ID'; 

  async function loadCar() {
    try {
      const data = await fetchCarBySlug(slug);
      if (!data) {
        setError(t('error'));
        setCar(null);
      } else {
        setCar(data);
        setError('');
        loadSimilarCars(data);
      }
    } catch (err) {
      console.error('Ошибка загрузки машины:', err);
      setError(t('error_loading'));
      setCar(null);
    } finally {
      setLoading(false);
    }
  }

  async function loadSimilarCars(carData) {
    try {
      setSimilarLoading(true);
      const similar = await fetchSimilarCars(carData.brand, carData.id);
      setSimilarCars(similar || []);
    } catch (err) {
      console.error('Ошибка загрузки похожих машин:', err);
      setSimilarCars([]);
    } finally {
      setSimilarLoading(false);
    }
  }

  useEffect(() => {
    if (slug) {
      setLoading(true);
      loadCar();
    }
  }, [slug]);

  const nextPhoto = () => {
    if (car.mediaUrlPhoto && car.mediaUrlPhoto.length > 0) {
      setCurrentPhotoIndex((prev) => 
        prev === car.mediaUrlPhoto.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (car.mediaUrlPhoto && car.mediaUrlPhoto.length > 0) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? car.mediaUrlPhoto.length - 1 : prev - 1
      );
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        nextPhoto();
      } else {
        prevPhoto();
      }
    }
    
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleCall = () => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert(`${t('call_alert')} ${phoneNumber}`);
    }
  };

  const handleWatchVideo = () => {
    if (car.mediaUrlVideo) {
      window.open(car.mediaUrlVideo, '_blank');
    } else {
      window.open(instagramVideoUrl, '_blank');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleThumbnailClick = (index) => {
    setCurrentPhotoIndex(index);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        {t('loading')}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2 className={styles.errorTitle}>{error}</h2>
        <Link href={'/'}>
          <button className={styles.backButton}>
            {t('back_to_base')}
          </button>
        </Link>
      </div>
    );
  }

  const currentPhoto = car.mediaUrlPhoto && car.mediaUrlPhoto.length > 0 
    ? car.mediaUrlPhoto[currentPhotoIndex] 
    : '/placeholder-car.jpg';

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.leftColumn}>
          <div className={styles.mainPhotoContainer}>
            <img
              src={currentPhoto}
              alt={`${car.brand} ${car.model}`}
              className={styles.mainPhoto}
              onClick={openModal}
            />
          </div>

          {car.mediaUrlPhoto && car.mediaUrlPhoto.length > 1 && (
            <div className={styles.thumbnailsContainer}>
              <button className={styles.arrowButton} onClick={prevPhoto}>
                ‹
              </button>
              
              <div className={styles.thumbnails}>
                {car.mediaUrlPhoto.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${car.brand} ${car.model} ${index + 1}`}
                    className={`${styles.thumbnail} ${
                      index === currentPhotoIndex ? styles.active : ''
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  />
                ))}
              </div>

              <button className={styles.arrowButton} onClick={nextPhoto}>
                ›
              </button>
            </div>
          )}
        </div>

        <div className={styles.mobileSlider}>
          <div 
            className={styles.mobileSliderContainer}
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className={styles.mobileSliderWrapper}
              style={{ transform: `translateX(-${currentPhotoIndex * 100}%)` }}
            >
              {car.mediaUrlPhoto && car.mediaUrlPhoto.map((photo, index) => (
                <div key={index} className={styles.mobileSlide}>
                  <img
                    src={photo}
                    alt={`${car.brand} ${car.model} ${index + 1}`}
                    className={styles.mobileSlideImage}
                    onClick={openModal}
                  />
                </div>
              ))}
            </div>
            
            {car.mediaUrlPhoto && car.mediaUrlPhoto.length > 1 && (
              <>
                <button 
                  className={`${styles.mobileSliderArrow} ${styles.mobileSliderArrowLeft}`}
                  onClick={prevPhoto}
                >
                  ‹
                </button>
                <button 
                  className={`${styles.mobileSliderArrow} ${styles.mobileSliderArrowRight}`}
                  onClick={nextPhoto}
                >
                  ›
                </button>
              </>
            )}
          </div>
          
          {car.mediaUrlPhoto && car.mediaUrlPhoto.length > 1 && (
            <div className={styles.mobileSliderDots}>
              {car.mediaUrlPhoto.map((_, index) => (
                <div
                  key={index}
                  className={`${styles.mobileSliderDot} ${
                    index === currentPhotoIndex ? styles.active : ''
                  }`}
                  onClick={() => setCurrentPhotoIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              {car.brand} {car.model}
            </h1>
            <h2 className={styles.price}>
              {car.price} €
            </h2>
          </div>

          <div className={styles.specsSection}>
            <h3 className={styles.specsTitle}>{t('characteristics')}</h3>
            <div className={styles.specsGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('brand')}</span>
                <span className={styles.specValue}>{car.brand}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('model')}</span>
                <span className={styles.specValue}>{car.model}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('year')}</span>
                <span className={styles.specValue}>{car.yearOfManufacture}</span>
              </div>
              {car.bodyType && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>{t('body_type')}</span>
                  <span className={styles.specValue}>{car.bodyType}</span>
                </div>
              )}
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('mileage')}</span>
                <span className={styles.specValue}>{car.mileage} {t('km')}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('engine_volume')}</span>
                <span className={styles.specValue}>{car.engineDisplacement} {t('cm3')}</span>
              </div>
              {car.power && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>{t('power')}</span>
                  <span className={styles.specValue}>{car.power} {t('hp')}</span>
                </div>
              )}
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('fuel_type')}</span>
                <span className={styles.specValue}>{car.fuelType}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('gearbox')}</span>
                <span className={styles.specValue}>{car.gearbox}</span>
              </div>
              {car.drive && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>{t('drive')}</span>
                  <span className={styles.specValue}>{car.drive}</span>
                </div>
              )}
              {car.color && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>{t('color')}</span>
                  <span className={styles.specValue}>{car.color}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

     
      <div className={styles.videoButtonBLock}>
        <button className={styles.videoButton} onClick={handleWatchVideo}>
           {t('watch_video')}
        </button>
        <button className={styles.callButton} onClick={handleCall}>
           {t('contact_us')}
        </button>
      </div>

     
    

      <CarsList />

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>
            <img
              src={currentPhoto}
              alt={`${car.brand} ${car.model}`}
              className={styles.modalImage}
            />
            {car.mediaUrlPhoto && car.mediaUrlPhoto.length > 1 && (
              <>
                <button 
                  className={`${styles.modalArrow} ${styles.modalArrowLeft}`} 
                  onClick={prevPhoto}
                >
                  ‹
                </button>
                <button 
                  className={`${styles.modalArrow} ${styles.modalArrowRight}`} 
                  onClick={nextPhoto}
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}