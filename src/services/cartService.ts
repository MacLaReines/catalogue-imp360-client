import api from './api';

export const addToCart = async (productId: string) => {
  await api.post('/cart', { productId });
};
