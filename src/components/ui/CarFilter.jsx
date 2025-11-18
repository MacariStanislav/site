'use client';

import { useEffect, useState, useRef } from 'react';
import CarCard from './CarCard';
import '@/styles/cars/carList.css';
import '@/styles/cars/carFilter.css';
import { fetchCars } from '@/utils/carsApi';

export default function CarFilter() {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [tempPriceRange, setTempPriceRange] = useState([0, 50000]);
    const [appliedPriceRange, setAppliedPriceRange] = useState([0, 50000]);
    const [brandFilter, setBrandFilter] = useState('');
    const [bodyFilter, setBodyFilter] = useState('');
    const [transmissionFilter, setTransmissionFilter] = useState('');
    const [driveFilter, setDriveFilter] = useState('');
    const [page, setPage] = useState(0);
    const [visibleCount, setVisibleCount] = useState(15);
    const [brandSearch, setBrandSearch] = useState('');
    const [bodySearch, setBodySearch] = useState('');

    const carsContentRef = useRef(null);

    const brands = ['BMW', 'Mercedes', 'Toyota', 'Volkswagen', 'Dacia', 'Opel', 'Volvo', 'Audi', 'Skoda', 'Peugeot', 'Renault', 'Citroen'];
    const bodyTypes = ['SUV', 'Crossover', 'Sedan', 'Hatchback'];
    const transmissions = ['Manual', 'Automatic'];
    const drives = ['FWD', 'RWD', 'AWD'];

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

    const filteredBodyTypes = bodyTypes.filter(type =>
        type.toLowerCase().includes(bodySearch.toLowerCase())
    );

    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth <= 480) setVisibleCount(5);
            else if (window.innerWidth <= 768) setVisibleCount(10);
            else setVisibleCount(15);
        };
        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    useEffect(() => {
        async function loadCars() {
            try {
                const data = await fetchCars();
                if (Array.isArray(data)) setCars(data);
            } catch (err) {
                console.error(err);
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
        setFilteredCars(result);
        setPage(0);
    }, [cars, appliedPriceRange, brandFilter, bodyFilter, transmissionFilter, driveFilter]);

    const applyFilters = () => {
        setAppliedPriceRange([...tempPriceRange]);
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
            const element = carsContentRef.current;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - 200;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setTimeout(scrollToTop, 100);
    };

    const maxPage = Math.ceil(filteredCars.length / visibleCount) - 1;
    const displayCars = filteredCars.slice(page * visibleCount, (page + 1) * visibleCount);

    const fillWidth = ((tempPriceRange[1] - tempPriceRange[0]) / 50000) * 100;
    const fillLeft = (tempPriceRange[0] / 50000) * 100;

    return (
        <div className="car_filter_wrapper">
            <div className="price_filter_section">
                <div className="price_header">
                    <h3>Цена</h3>
                </div>
                <div className="price_slider_container">
                    <div className="slider_track">
                        <div
                            className="slider_fill"
                            style={{
                                left: `${fillLeft}%`,
                                width: `${fillWidth}%`
                            }}
                        ></div>
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
                    фильтр
                </button>
            </div>

            <div className="main_content">
                <div className="filters_sidebar">
                    <div className="filter_section">
                        <h3>Марка</h3>
                        <div className="search_input">
                            <input
                                type="text"
                                placeholder="Найти по марке"
                                value={brandSearch}
                                onChange={(e) => setBrandSearch(e.target.value)}
                            />
                        </div>
                        <div className="filter_buttons">
                            {filteredBrands.map(brand => (
                                <button
                                    key={brand}
                                    className={`filter_btn ${brandFilter === brand ? 'active' : ''}`}
                                    onClick={() => setBrandFilter(brandFilter === brand ? '' : brand)}
                                >
                                    <span className="filter_text">{brand}</span>
                                    <span className="filter_count">{brandCounts[brand] || 0}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter_section">
                        <h3>Тип Кузова</h3>
                        <div className="search_input">
                            <input
                                type="text"
                                placeholder="Найти по кузову"
                                value={bodySearch}
                                onChange={(e) => setBodySearch(e.target.value)}
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
                                        {type === 'SUV' ? 'Внедорожник' :
                                            type === 'Crossover' ? 'Кроссовер' :
                                                type === 'Sedan' ? 'Седан' : 'Хэтчбек'}
                                    </span>
                                    <span className="filter_count">{bodyTypeCounts[type] || 0}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter_section">
                        <h3>КПП</h3>
                        <div className="filter_buttons">
                            {transmissions.map(trans => (
                                <button
                                    key={trans}
                                    className={`filter_btn ${transmissionFilter === trans ? 'active' : ''}`}
                                    onClick={() => setTransmissionFilter(transmissionFilter === trans ? '' : trans)}
                                >
                                    <span className="filter_text">
                                        {trans === 'Manual' ? 'Механика' : 'Автомат'}
                                    </span>
                                    <span className="filter_count">{transmissionCounts[trans] || 0}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter_section">
                        <h3>Привод</h3>
                        <div className="filter_buttons">
                            {drives.map(drive => (
                                <button
                                    key={drive}
                                    className={`filter_btn ${driveFilter === drive ? 'active' : ''}`}
                                    onClick={() => setDriveFilter(driveFilter === drive ? '' : drive)}
                                >
                                    <span className="filter_text">
                                        {drive === 'FWD' ? 'Передний' :
                                            drive === 'RWD' ? 'Задний' : '4x4'}
                                    </span>
                                    <span className="filter_count">{driveCounts[drive] || 0}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="cars_content" ref={carsContentRef}>
                    <div className="car_list">
                        {displayCars.map(car => (
                            <CarCard key={car.slug} car={car} />
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            disabled={page === 0}
                            onClick={() => handlePageChange(page - 1)}
                        >
                            Назад
                        </button>
                        <span>{page + 1} / {maxPage + 1 || 1}</span>
                        <button
                            disabled={page === maxPage || maxPage < 0}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            Вперед
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}