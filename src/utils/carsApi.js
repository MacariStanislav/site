import api from './api';

export const fetchCars = async () => {
  try {
    const response = await api.get('/cars'); 
    return response.data;
  } catch (error) {
    console.error('где-то проёб в получение тачек либо путь либо на беке', error);
    throw error;
  }
};

export const fetchCarsPaginated = async (page = 1, limit = 15) => {
  try {
    const response = await api.get('/cars/paginated', {
      params: {
        page,
        limit
      }
    }); 
    return response.data;
  } catch (error) {
    console.error('Проёб в пагинации машин', error);
    throw error;
  }
};

export const fetchAllCarsPaginated = async () => {
  try {
    let allCars = [];
    let currentPage = 1;
    let hasMore = true;

    console.log('Начинаем загрузку всех машин через пагинацию...');

    while (hasMore) {
      const response = await api.get('/cars/paginated', {
        params: {
          page: currentPage,
          limit: 50
        }
      });
      
      allCars = [...allCars, ...response.data.cars];
      hasMore = response.data.pagination.hasNext;
      currentPage++;
      
      console.log(`Загружена страница ${currentPage - 1}, машин: ${allCars.length}`);
      
      if (currentPage > 100) {
        console.warn('Достигнут лимит в 100 страниц, прерываем загрузку');
        break;
      }
    }

    console.log(`Всего загружено машин: ${allCars.length}`);
    return allCars;
  } catch (error) {
    console.error('Проёб в получении всех машин через пагинацию', error);
    throw error;
  }
};

export const fetchCarBySlug = async (slug) => {
  try {
    const response = await api.get(`/cars/${slug}`); 
    return response.data;
  } catch (error) {
    console.error('если тут проёб значит на беке проблема ', error);
    throw error;
  }
};

export const fetchSimilarCars = async (brand, excludeId, limit = 4) => {
  try {
    const allCars = await fetchCars();
    
    const similarCars = allCars
      .filter(car => 
        car.brand === brand && 
        car.id !== excludeId &&
        car.mediaUrlPhoto && 
        car.mediaUrlPhoto.length > 0
      )
      .slice(0, limit);
    
    return similarCars;
  } catch (error) {
    console.error('Проёб в получении похожих машин', error);
    
    return [];
  }
};

export const fetchSimilarCarsPaginated = async (brand, excludeId, limit = 4) => {
  try {
    const allCars = await fetchAllCarsPaginated();
    
    const similarCars = allCars
      .filter(car => 
        car.brand === brand && 
        car.id !== excludeId &&
        car.mediaUrlPhoto && 
        car.mediaUrlPhoto.length > 0
      )
      .slice(0, limit);
    
    return similarCars;
  } catch (error) {
    console.error('Проёб в получении похожих машин через пагинацию', error);
    
    try {
      const allCars = await fetchCars();
      const similarCars = allCars
        .filter(car => 
          car.brand === brand && 
          car.id !== excludeId &&
          car.mediaUrlPhoto && 
          car.mediaUrlPhoto.length > 0
        )
        .slice(0, limit);
      
      return similarCars;
    } catch (fallbackError) {
      console.error('И запасной вариант тоже не сработал', fallbackError);
      return [];
    }
  }
};