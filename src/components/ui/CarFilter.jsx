'use client';

import { useEffect, useState, useRef, useMemo, memo } from 'react';
import CarCard from './CarCard';
import '@/styles/cars/carList.css';
import '@/styles/cars/carFilter.css';
import { fetchCars } from '@/utils/carsApi';
import brandCar from '@/components/lib/home/cars';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

// Мемоизированные компоненты инпутов
const BrandSearchInput = memo(({ value, onChange, placeholder }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
));

BrandSearchInput.displayName = 'BrandSearchInput';

const BodySearchInput = memo(({ value, onChange, placeholder }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
));

BodySearchInput.displayName = 'BodySearchInput';

export default function CarFilter() {
    const t = useTranslations('CarFilter');
    const searchParams = useSearchParams();
    const brandFromQuery = searchParams.get('brand');

    const [brandFilter, setBrandFilter] = useState(brandFromQuery || '');
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [tempPriceRange, setTempPriceRange] = useState([0, 50000]);
    const [appliedPriceRange, setAppliedPriceRange] = useState([0, 50000]);
    const [bodyFilter, setBodyFilter] = useState('');
    const [transmissionFilter, setTransmissionFilter] = useState('');
    const [driveFilter, setDriveFilter] = useState('');
    const [page, setPage] = useState(0);
    const [visibleCount, setVisibleCount] = useState(15);
    const [brandSearch, setBrandSearch] = useState('');
    const [bodySearch, setBodySearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [sortByNewest, setSortByNewest] = useState(true);

    const carsContentRef = useRef(null);
    const mobileFiltersRef = useRef(null);

    const brands = ['BMW', 'Mercedes', 'Toyota', 'Volkswagen', 'Dacia', 'Opel', 'Volvo', 'Audi', 'Scoda', 'Peugeot', 'Renault', 'Citroen'];
    const bodyTypes = ['SUV', 'Crossover', 'Sedan', 'Hatchback'];
    const transmissions = ['Manual', 'Automatic'];
    const drives = ['FWD', 'RWD', 'AWD'];

    // Словари для мультиязычного поиска
    const bodyTypeTranslations = {
        'SUV': ['внедорожник', 'suv', 'джип', 'suv'],
        'Crossover': ['кроссовер', 'crossover', 'паркетник', 'crossover'],
        'Sedan': ['седан', 'sedan'],
        'Hatchback': ['хэтчбек', 'hatchback', 'хетчбек', 'hatchback']
    };

    const transmissionTranslations = {
        'Manual': ['механика', 'manual', 'механическая', 'manuală'],
        'Automatic': ['автомат', 'automatic', 'автоматическая', 'automată']
    };

    const driveTranslations = {
        'FWD': ['передний', 'fwd', 'передний привод', 'față', 'tracțiune față'],
        'RWD': ['задний', 'rwd', 'задний привод', 'spate', 'tracțiune spate'], 
        'AWD': ['4x4', 'awd', 'полный', 'полный привод', 'integrală', 'tracțiune integrală']
    };

    // Функции для получения переведенных названий
    const getBodyTypeName = (type) => {
        const translations = {
            'SUV': t('suv'),
            'Crossover': t('crossover'),
            'Sedan': t('sedan'),
            'Hatchback': t('hatchback')
        };
        return translations[type] || type;
    };

    const getTransmissionName = (trans) => {
        const translations = {
            'Manual': t('manual'),
            'Automatic': t('automatic')
        };
        return translations[trans] || trans;
    };

    const getDriveName = (drive) => {
        const translations = {
            'FWD': t('fwd'),
            'RWD': t('rwd'),
            'AWD': t('awd')
        };
        return translations[drive] || drive;
    };

    // Функция для корректировки видимого количества, чтобы всегда было нечётным
    const getAdjustedVisibleCount = () => {
        if (window.innerWidth <= 480) return 4; // 5 - нечётное
        else if (window.innerWidth <= 768) return 6; // 9 - нечётное вместо 10
        else return 16; // 15 - нечётное
    };

    useEffect(() => {
        const updateVisibleCount = () => {
            setVisibleCount(getAdjustedVisibleCount());
        };
        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    useEffect(() => {
        async function loadCars() {
            try {
                setLoading(true);
                const data = await fetchCars();
                if (Array.isArray(data)) {
                    setCars(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadCars();
    }, []);

    useEffect(() => {
        let result = cars.filter(car =>
            car.price >= appliedPriceRange[0] &&
            car.price <= appliedPriceRange[1] &&
            (brandFilter ? car.brand === brandFilter : true) &&
            (bodyFilter ? car.bodyType === bodyFilter : true) &&
            (transmissionFilter ? car.gearbox === transmissionFilter : true) &&
            (driveFilter ? car.drive === driveFilter : true)
        );

        if (sortByNewest) {
            result.sort((a, b) => new Date(b.createdAt || b.dateAdded || 0) - new Date(a.createdAt || a.dateAdded || 0));
        } else {
            result.sort((a, b) => new Date(a.createdAt || a.dateAdded || 0) - new Date(b.createdAt || b.dateAdded || 0));
        }

        setFilteredCars(result);
        setPage(0);
    }, [cars, appliedPriceRange, brandFilter, bodyFilter, transmissionFilter, driveFilter, sortByNewest]);

    const applyFilters = () => {
        setAppliedPriceRange([...tempPriceRange]);
        if (window.innerWidth <= 900) {
            setIsMobileFiltersOpen(false);
        }
    };

    const resetFilters = () => {
        setTempPriceRange([0, 50000]);
        setAppliedPriceRange([0, 50000]);
        setBrandFilter('');
        setBodyFilter('');
        setTransmissionFilter('');
        setDriveFilter('');
        setBrandSearch('');
        setBodySearch('');
    };

    const handleMinPriceChange = (e) => {
        const value = Math.min(Number(e.target.value), tempPriceRange[1]);
        setTempPriceRange([value, tempPriceRange[1]]);
    };

    const handleMaxPriceChange = (e) => {
        const value = Math.max(Number(e.target.value), tempPriceRange[0]);
        setTempPriceRange([tempPriceRange[0], value]);
    };

    const scrollToTop = () => {
        if (carsContentRef.current) {
            const elementPosition = carsContentRef.current.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: elementPosition - 200, behavior: 'smooth' });
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setTimeout(scrollToTop, 100);
    };

    const toggleSortByNewest = () => setSortByNewest(!sortByNewest);

    useEffect(() => {
        function handleClickOutside(event) {
            if (mobileFiltersRef.current && !mobileFiltersRef.current.contains(event.target) &&
                !event.target.closest('.mobile-filters-btn')) {
                setIsMobileFiltersOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Функции для мультиязычного поиска
    const getTranslatedOptions = (searchTerm, options, translations) => {
        if (!searchTerm) return options;
        
        return options.filter(option => {
            const optionLower = option.toLowerCase();
            const searchLower = searchTerm.toLowerCase();
            
            // Поиск в оригинальном названии
            if (optionLower.includes(searchLower)) return true;
            
            // Поиск в переводах
            if (translations[option]) {
                return translations[option].some(translation => 
                    translation.toLowerCase().includes(searchLower)
                );
            }
            
            return false;
        });
    };

    const maxPage = Math.ceil(filteredCars.length / visibleCount) - 1;
    const displayCars = filteredCars.slice(page * visibleCount, (page + 1) * visibleCount);

    const fillWidth = ((tempPriceRange[1] - tempPriceRange[0]) / 50000) * 100;
    const fillLeft = (tempPriceRange[0] / 50000) * 100;

    const SkeletonCard = () => (
        <div className="car_card_skeleton">
            <div className="skeleton_image"></div>
            <div className="skeleton_content">
                <div className="skeleton_title"></div>
                <div className="skeleton_text"></div>
                <div className="skeleton_text short"></div>
                <div className="skeleton_price"></div>
            </div>
        </div>
    );

    // Мемоизированный компонент фильтров
    const FiltersSidebar = useMemo(() => {
        const brandCounts = brands.reduce((acc, brand) => {
            acc[brand] = cars.filter(car => car.brand === brand).length;
            return acc;
        }, {});

        const bodyTypeCounts = bodyTypes.reduce((acc, type) => {
            acc[type] = cars.filter(car => car.bodyType === type).length;
            return acc;
        }, {});

        const transmissionCounts = transmissions.reduce((acc, trans) => {
            acc[trans] = cars.filter(car => car.gearbox === trans).length;
            return acc;
        }, {});

        const driveCounts = drives.reduce((acc, drive) => {
            acc[drive] = cars.filter(car => car.drive === drive).length;
            return acc;
        }, {});

        const filteredBrands = brands.filter(brand => 
            brand.toLowerCase().includes(brandSearch.toLowerCase())
        );

        const filteredBodyTypes = getTranslatedOptions(bodySearch, bodyTypes, bodyTypeTranslations);
        const filteredTransmissions = getTranslatedOptions(bodySearch, transmissions, transmissionTranslations);
        const filteredDrives = getTranslatedOptions(bodySearch, drives, driveTranslations);

        return (
            <div className="filters_sidebar">
                <div className="filter_section">
                    <h3 className='mobile'>{t('price')}</h3>
                    <div className="price_slider_container mobile">
                        <div className="slider_track">
                            <div className="slider_fill" style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}></div>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="50000" 
                            value={tempPriceRange[0]} 
                            onChange={handleMinPriceChange} 
                            className="range_min" 
                        />
                        <input 
                            type="range" 
                            min="0" 
                            max="50000" 
                            value={tempPriceRange[1]} 
                            onChange={handleMaxPriceChange} 
                            className="range_max" 
                        />
                    </div>
                    <div className="price_display mobile">
                        {tempPriceRange[0]} € - {tempPriceRange[1]} €
                    </div>
                </div>

                <div className="filter_section">
                    <h3>{t('brand')}</h3>
                    <div className="search_input">
                        <BrandSearchInput 
                            value={brandSearch} 
                            onChange={(e) => setBrandSearch(e.target.value)}
                            placeholder={t('search_by_brand')}
                        />
                    </div>
                    <div className="filter_buttons">
                        {filteredBrands.map(brand => (
                            <button 
                                key={brand} 
                                className={`filter_btn ${brandFilter === brand ? 'active' : ''}`} 
                                onClick={() => setBrandFilter(brandFilter === brand ? '' : brand)}
                            >
                                <div className="brand_content">
                                    <img src={brandCar[brand]} alt={brand} className="brand_icon" />
                                    <span className="filter_text">{brand}</span>
                                </div>
                                <span className="filter_count">{brandCounts[brand] || 0}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter_section">
                    <h3>{t('body_type')}</h3>
                    <div className="search_input">
                        <BodySearchInput 
                            value={bodySearch} 
                            onChange={(e) => setBodySearch(e.target.value)}
                            placeholder={t('search_by_body')}
                        />
                    </div>
                    <div className="filter_buttons">
                        {filteredBodyTypes.map(type => (
                            <button 
                                key={type} 
                                className={`filter_btn ${bodyFilter === type ? 'active' : ''}`} 
                                onClick={() => setBodyFilter(bodyFilter === type ? '' : type)}
                            >
                                <span className="filter_text">
                                    {getBodyTypeName(type)}
                                </span>
                                <span className="filter_count">{bodyTypeCounts[type] || 0}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter_section">
                    <h3>{t('gearbox')}</h3>
                    <div className="filter_buttons">
                        {filteredTransmissions.map(trans => (
                            <button 
                                key={trans} 
                                className={`filter_btn ${transmissionFilter === trans ? 'active' : ''}`} 
                                onClick={() => setTransmissionFilter(transmissionFilter === trans ? '' : trans)}
                            >
                                <span className="filter_text">
                                    {getTransmissionName(trans)}
                                </span>
                                <span className="filter_count">{transmissionCounts[trans] || 0}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter_section">
                    <h3>{t('drive')}</h3>
                    <div className="filter_buttons">
                        {filteredDrives.map(drive => (
                            <button 
                                key={drive} 
                                className={`filter_btn ${driveFilter === drive ? 'active' : ''}`} 
                                onClick={() => setDriveFilter(driveFilter === drive ? '' : drive)}
                            >
                                <span className="filter_text">
                                    {getDriveName(drive)}
                                </span>
                                <span className="filter_count">{driveCounts[drive] || 0}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mobile_filter_actions">
                    <button className="filter_apply_btn mobile" onClick={applyFilters}>
                        {t('apply_filters')}
                    </button>
                    <button className="filter_reset_btn" onClick={resetFilters}>
                        {t('reset_all')}
                    </button>
                </div>
            </div>
        );
    }, [cars, brandFilter, bodyFilter, transmissionFilter, driveFilter, tempPriceRange, brandSearch, bodySearch, fillLeft, fillWidth, t]);

    return (
        <div className="car_filter_wrapper">
            <div className="price_filter_section desktop-only">
                <div className="price_header">
                    <h3>{t('price')}</h3>
                </div>
                <div className="price_slider_container">
                    <div className="slider_track">
                        <div className="slider_fill" style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}></div>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="50000" 
                        value={tempPriceRange[0]} 
                        onChange={handleMinPriceChange} 
                        className="range_min" 
                    />
                    <input 
                        type="range" 
                        min="0" 
                        max="50000" 
                        value={tempPriceRange[1]} 
                        onChange={handleMaxPriceChange} 
                        className="range_max" 
                    />
                </div>
                <div className="price_display">
                    {tempPriceRange[0]} € - {tempPriceRange[1]} €
                </div>
                <button className="filter_apply_btn" onClick={applyFilters}>
                    {t('filter')}
                </button>
            </div>

            <div className="mobile_filters_header">
                <button 
                    className="mobile-filters-btn"
                    onClick={() => setIsMobileFiltersOpen(true)}
                >
                    <img src="/icons/Sort_up.svg" alt="" />
                    {t('show_filters')}
                    {((appliedPriceRange[0] > 0 || appliedPriceRange[1] < 50000) || brandFilter || bodyFilter || transmissionFilter || driveFilter) && (
                        <span className="filters-indicator"></span>
                    )}
                </button>
            </div>

            <div className="main_content">
                <div className="filters_sidebar desktop-only1">
                    {FiltersSidebar}
                </div>

                <div className="cars_content" ref={carsContentRef}>
                    <div className="car_list">
                        {loading ? (
                            Array.from({ length: visibleCount }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                        ) : (
                            displayCars.map(car => (
                                <CarCard key={car.slug} car={car} />
                            ))
                        )}
                    </div>

                    {!loading && (
                        <div className="pagination">
                            <button
                                disabled={page === 0}
                                onClick={() => handlePageChange(page - 1)}
                                className="pagination-arrow"
                            >
                                <svg width="28" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              
                            </button>
                            
                            <div className="pagination-pages">
                                {Array.from({ length: Math.min(5, maxPage + 1) }, (_, i) => {
                                    let pageNum;
                                    if (maxPage <= 4) {
                                        pageNum = i;
                                    } else if (page <= 2) {
                                        pageNum = i;
                                    } else if (page >= maxPage - 2) {
                                        pageNum = maxPage - 4 + i;
                                    } else {
                                        pageNum = page - 2 + i;
                                    }
                                    
                                    return (
                                        <button
                                            key={pageNum}
                                            className={`pagination-page ${page === pageNum ? 'active' : ''}`}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <button
                                disabled={page === maxPage || maxPage < 0}
                                onClick={() => handlePageChange(page + 1)}
                                className="pagination-arrow"
                            >
                                
                                <svg width="28" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={`mobile_filters_overlay ${isMobileFiltersOpen ? 'active' : ''}`}></div>
            
            <div 
                ref={mobileFiltersRef}
                className={`mobile_filters_sidebar ${isMobileFiltersOpen ? 'active' : ''}`}
            >
                <div className="mobile_filters_header_sidebar">
                    <h2>{t('filters')}</h2>
                    <button 
                        className="close_filters_btn"
                        onClick={() => setIsMobileFiltersOpen(false)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
                <div className="mobile_filters_content">
                    {FiltersSidebar}
                </div>
            </div>
        </div>
    );
}