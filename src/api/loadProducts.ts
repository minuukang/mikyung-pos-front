import api from './index';
import { Product } from '@/store/types';

export default function loadProducts(): Promise<Product[]> {
  return api.get('/products')
    .then(({ data }) => data);
}
