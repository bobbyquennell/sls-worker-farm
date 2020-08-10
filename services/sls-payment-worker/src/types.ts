export interface OrderEvent {
  eventType: EventType;
  message:
    | OrderRequestedMsg
    | OrderCreatedMsg
    | OrderConfirmedMsg
    | PaymentSucceededMsg;
}

export interface OrderRequestedMsg {
  itemId: string;
  itemName: string;
  itemQty: number;
  totalPrice: number;
  paymentToken: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
}
export enum EventType {
  OrderRequested = 'OrderRequested',
  OrderCreated = 'OrderCreated',
  OrderConfirmed = 'OrderConfirmed',
  PaymentSucceeded = 'PaymentSucceeded',
}

export interface OrderCreatedMsg {
  orderId: string;
  paymentToken: string;
}

export interface OrderConfirmedMsg {
  orderId: string;
}

export interface PaymentSucceededMsg {
  orderId: string;
  paymentId: string;
}
