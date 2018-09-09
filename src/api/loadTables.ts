import api from './index';
import { Table } from '@/store/types'

export default function loadInfos (): Promise<Table[]> {
  return api.get('/orders/info')
    .then(({ data }) => data)
}
