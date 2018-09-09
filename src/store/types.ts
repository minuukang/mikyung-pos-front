export interface Table {
  orderInfoId: number
  orderInfoType: string
  orderInfoNo: number
  useYn: boolean
  orders: Order[]
}

export interface Order {
  orderId: number
  orderDate: number
  orderProductList: OrderItem[]
  orderComplete: boolean
}

export interface OrderItem {
  orderProductId: number
  productOrderCount: number
  productName: string
  originAmount: number
  salesAmount: number
  complete: boolean
  payment: boolean
}

export interface ProductGroup {
  productGroupId: number
  productGroupName: string
  products: Product[]
}

export interface Product {
  productId: number
  productName: string
  originAmount: number
  salesAmount: number
  soldoutYn: boolean
}
