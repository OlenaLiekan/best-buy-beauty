import { $authHost, $host } from './index';

export const createType = async type => {
  const { data } = await $authHost.post('api/type', type);
  return data;
};

export const fetchTypes = async () => {
  const { data } = await $host.get('api/type');
  return data;
};

export const fetchAndUpdateType = async (type, id) => {
  const { data } = await $authHost.put('api/type/' + id, type);
  return data;
};

export const createBrand = async brand => {
  const { data } = await $authHost.post('api/brand', brand);
  return data;
};

export const fetchBrands = async () => {
  const { data } = await $host.get('api/brand');
  return data;
};

export const updateBrand = async (brand, id) => {
  const { data } = await $authHost.put('api/brand/' + id, brand);
  return data;
};

export const createSlide = async slide => {
  const { data } = await $authHost.post('api/slide', slide);
  return data;
};

export const fetchSlides = async () => {
  const { data } = await $host.get('api/slide');
  return data;
};

export const createProduct = async product => {
  const { data } = await $authHost.post('api/product', product);
  return data;
};

export const fetchProducts = async () => {
  const { data } = await $host.get('api/product');
  return data;
};

export const fetchOneProduct = async id => {
  const { data } = await $host.get('api/product/' + id);
  return data;
};

export const updateProduct = async (product, id) => {
  const { data } = await $authHost.patch('api/product/' + id, product);
  return data;
};

export const createRating = async rating => {
  const { data } = await $authHost.post('api/rating', rating);
  return data;
};

export const createReview = async review => {
  const { data } = await $authHost.post('api/review', review);
  return data;
};
