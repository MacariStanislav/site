import api from './api';

// Константы ошибок (не экспортируем)
const ERROR_MESSAGES = {
  DEFAULT: 'Ошибка загрузки',
  NETWORK: 'Проблемы с соединением',
  NOT_FOUND: 'Не найдено'
};

// Обертка для всех API функций
const createSecureApiCall = (fn) => {
  const wrapper = async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      // Всегда возвращаем безопасный fallback
      return getFallbackForFunction(fn.name, args);
    }
  };
  
  // Маскируем имя функции
  Object.defineProperty(wrapper, 'name', {
    value: 'apiCall',
    writable: false,
    configurable: false
  });
  
  return wrapper;
};

// Fallback данные для разных функций
function getFallbackForFunction(funcName, args) {
  if (funcName.includes('fetchCars') || funcName.includes('Similar')) {
    return [];
  }
  
  if (funcName.includes('fetchCarBySlug')) {
    return null;
  }
  
  if (funcName.includes('Paginated')) {
    const [page = 1, limit = 15] = args;
    return {
      cars: [],
      pagination: {
        page,
        limit,
        total: 0,
        hasNext: false
      }
    };
  }
  
  return null;
}

export const fetchCars = createSecureApiCall(async () => {
  const response = await api.get('/cars');
  return response.data?.data || response.data || [];
});

export const fetchCarsPaginated = createSecureApiCall(async (page = 1, limit = 15) => {
  // Валидация параметров
  page = Math.max(1, parseInt(page) || 1);
  limit = Math.min(Math.max(1, parseInt(limit) || 15), 100);
  
  const response = await api.get('/cars/paginated', {
    params: { page, limit }
  });
  
  return response.data?.data || response.data || {
    cars: [],
    pagination: { page, limit, total: 0, hasNext: false }
  };
});

export const fetchAllCarsPaginated = createSecureApiCall(async () => {
  let allCars = [];
  let currentPage = 1;
  let hasMore = true;
  
  while (hasMore && currentPage <= 50) { // Ограничение 50 страниц
    const response = await api.get('/cars/paginated', {
      params: { page: currentPage, limit: 50 }
    });
    
    const data = response.data?.data || response.data;
    const cars = data?.cars || [];
    const pagination = data?.pagination || {};
    
    if (cars.length === 0) break;
    
    allCars = [...allCars, ...cars];
    hasMore = pagination.hasNext || false;
    currentPage++;
    
    // Задержка между запросами
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  // Удаляем дубликаты
  return Array.from(new Map(allCars.map(car => [car.id, car])).values());
});

export const fetchCarBySlug = createSecureApiCall(async (slug) => {
  // Валидация slug
  const cleanSlug = String(slug || '').replace(/[^a-zA-Z0-9-_]/g, '');
  if (!cleanSlug) return null;
  
  const response = await api.get(`/cars/${cleanSlug}`);
  return response.data?.data || response.data || null;
});

export const fetchSimilarCars = createSecureApiCall(async (brand, excludeId, limit = 4) => {
  const allCars = await fetchCars();
  
  return allCars
    .filter(car => {
      try {
        return (
          car &&
          car.brand === brand &&
          String(car.id) !== String(excludeId) &&
          car.mediaUrlPhoto &&
          Array.isArray(car.mediaUrlPhoto) &&
          car.mediaUrlPhoto.length > 0
        );
      } catch {
        return false;
      }
    })
    .slice(0, Math.min(limit, 20));
});