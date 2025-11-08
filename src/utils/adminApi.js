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
  photos ,
  video = "",
}) => {
  try {
    if (!photos.length) {
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
    formData.append('mediaUrlVideo', video);


  
 
    photos.forEach((photo) => formData.append('mediaUrlPhoto', photo));

 
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
