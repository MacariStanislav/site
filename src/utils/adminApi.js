import api from './api';

export const addCar = async ({
  name,
  brand,
  model,
  yearOfManufacture,
  bodyType,
  mileage,
  engineDisplacement,
  power,
  news,
  fuelType,
  gearbox,
  drive,
  color,
  price,
  photos,
  video = null,
}) => {
  try {
    if (!photos || !photos.length) {
      throw new Error('Необходимо добавить хотя бы одно фото.');
    }

    const formData = new FormData();

    formData.append('name', name);
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('yearOfManufacture', yearOfManufacture);
    formData.append('bodyType', bodyType);
    formData.append('mileage', mileage);
    formData.append('engineDisplacement', engineDisplacement);
    formData.append('power', power);
    formData.append('news', news);
    formData.append('fuelType', fuelType);
    formData.append('gearbox', gearbox);
    formData.append('drive', drive);
    formData.append('color', color);
    formData.append('price', price);

    if (video) formData.append('mediaUrlVideo', video);

    photos.forEach((photo) => formData.append('mediaUrlPhoto', photo));

    const response = await api.post('/cars', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (err) {
    console.error(err);
    return { error: err.message || 'Failed to add car' };
  }
};

export const deleteCar = async (id) => {
  try {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
    return { error: err.message || 'Failed to delete car' };
  }
};

export const addCarsBulk = async (cars) => {
  const results = [];
  for (const car of cars) {
    const { photos, video, ...rest } = car;
    const formData = new FormData();
    Object.entries(rest).forEach(([key, value]) => formData.append(key, value));
    if (video) formData.append('mediaUrlVideo', video);
    photos.forEach((photo) => formData.append('mediaUrlPhoto', photo));

    try {
      const res = await api.post('/cars/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      results.push(res.data);
    } catch (err) {
      results.push({ error: err.message });
    }
  }
  return results;
};
