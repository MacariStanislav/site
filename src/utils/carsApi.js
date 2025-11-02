
import api from './api';


export const fetchCars = async () => {
  try {
    const response = await api.get('/cars'); 
    return response.data;
  } catch (error) {
    console.error('где-то проёб в получение тачек либо путь либо на беке',error);
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

