
import api from './api';


export const fetchCars = async () => {
  try {
    const response = await api.get('/cars'); 
    return response.data;
  } catch (error) {
    console.error('ггде-то проёб в получение тачек либо путь либо на беке',error);
    throw error;
  }
};


export const fetchCarBySlug = async (slug) => {
  try {
    const response = await api.get(`/cars/${slug}`); 
    return response.data;
  } catch (error) {
    console.error('просто проёб скорее всего у дачки нету slug скорее всего с фронта ты не добавил добавление рандом slug', error);
    throw error;
  }
};

