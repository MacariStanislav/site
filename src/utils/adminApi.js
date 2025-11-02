import api from './api';

export const addCar = async ({ name, description, price, video, photos }) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    photos.forEach(photo => formData.append('mediaUrlPhoto', photo));//фото обязательно добавлять минимум одну это уже я на админ панели сделаю
    if (video) formData.append('mediaUrlVideo', video);





    const response = await api.post('/cars', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (err) {

    return { error: 'Failed to add car' };
  }
};

export const deleteCar = async (id) => {
  try {
    const response = await api.delete('/cars', { data: { id } });
    return response.data;
  } catch (err) {

    return { error: 'Failed to delete car' };
  }
};
