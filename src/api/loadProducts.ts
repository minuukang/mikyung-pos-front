import api from './index';
import { Food } from '@/store/types'

export default function loadProducts (): Promise<[]> {
  return api.get('/products')
    .then(({ data }) => data)
}
