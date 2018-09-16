import api from './index';
import { Order } from '@/store/types';

export interface OrderPaymentItem {
  productId: number;
  productOrderCount: number;
}

export interface OrderPaymentPayload {
  tableNo: number;
  orderOwnerName: string;
  receiveAmount: number;
  products: OrderPaymentItem[];
}

export interface OrderUpdatePayload {
  orderId: number;
  products: OrderPaymentItem[];
}

export interface OrderChangeStatusPayload {
  orderId: number;
  productId: number;
}

export interface OrderAndProductPayment {
  orderId: number;
  orderProductId: number;
}

export default {
  paymentOrder(payload: OrderPaymentPayload) {
    return api.post('/orders', payload);
  },
  exitOrder(orderId: number) {
    return api.put(`/orders/info/${orderId}/exit`).then(({ data }) => data);
  },
  changeStatus({ orderId, productId }: OrderChangeStatusPayload) {
    return api.put(`/orders/${orderId}/products/${productId}/changeStatus`);
  },
  completePayment(orderId: number) {
    return api.put(`/orders/${orderId}/completePayment`).then(({ data }) => data);
  },
  deleteOrder(orderId: number) {
    return api.delete(`/orders/${orderId}`);
  },
  detail(orderId: number): Promise<Order> {
    return api.get(`/orders/${orderId}`).then(({ data }) => data);
  },
  updateOrder({ orderId, products }: OrderUpdatePayload) {
    return api.put(`/orders/${orderId}`, { products });
  },
  complete(orderId: number) {
    return api.put(`/orders/${orderId}/orderComplete`);
  },
};
