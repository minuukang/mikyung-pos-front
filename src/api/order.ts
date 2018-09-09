import api from './index'
import { Order } from '@/store/types'

export interface OrderPaymentItem {
  productId: number
  productOrderCount: number
}

export interface OrderPaymentPayload {
  tableNo: number
  orderOwnerName: string
  products: OrderPaymentItem[]
}

export interface OrderUpdatePayload {
  orderId: number
  products: OrderPaymentItem[]
}

export interface OrderAndProductPayment {
  orderId: number
  orderProductId: number
}

export default {
  paymentOrder (payload: OrderPaymentPayload) {
    return api.post('/orders', payload)
  },
  detail (orderId: number): Promise<Order> {
    return api.get(`/orders/${orderId}`).then(({ data }) => data)
  },
  updateOrder ({ orderId, products }: OrderUpdatePayload) {
    return api.put(`/orders/${orderId}`, { products })
  },
  complete (orderId: number) {
    return api.put(`/orders/${orderId}/orderComplete`)
  },
  cookingComplete ({ orderId, orderProductId }: OrderAndProductPayment) {
    return api.put(`/orders/${orderId}/orderProduct/${orderProductId}/cookingComplete`)
  },
  paymentComplete ({ orderId, orderProductId }: OrderAndProductPayment) {
    return api.put(`/orders/${orderId}/orderProduct/${orderProductId}/cookingComplete`)
  }
}
