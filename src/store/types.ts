export interface Table {
  orderInfoId: number;
  orderInfoType: string;
  orderInfoNo: number;
  useYn: boolean;
  orders: Order[];
  infoBeginDate: number;
}

export interface Order {
  orderId: number;
  orderDate: number;
  orderProducts: OrderItem[];
  orderPaymentYn: boolean;
  orderSuccessYn: boolean;
  orderType: string;
  receiveAmount: number;
}

export interface OrderItem {
  orderProductId: number;
  productCount: number;
  orderProductStatus: string;
  product: Product;
}

export interface ProductGroup {
  productGroupId: number;
  productGroupName: string;
  products: Product[];
}

export interface Product {
  productId: number;
  productName: string;
  originAmount: number;
  salesAmount: number;
  soldoutYn: boolean;
  productAutoCookingCompleteYn: boolean;
}
