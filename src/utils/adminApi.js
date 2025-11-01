import api from './api';

export const addCar = async (carData) => {
  try {
    const formData = new FormData();
    formData.append('name', carData.name);
    formData.append('description', carData.description);
    formData.append('price', carData.price);
    if (carData.media) formData.append('media', carData.media);

    const response = await api.post('/cars', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    return { error: 'Failed to add car' };
  }
};

export const deleteCar = async (slug) => {
  try {
    const response = await api.delete(`/cars/${slug}`);
    return response.data;
  } catch (err) {
    console.error(err);
    return { error: 'Failed to delete car' };
  }
};
