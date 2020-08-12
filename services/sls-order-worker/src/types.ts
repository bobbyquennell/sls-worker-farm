export interface SagaEvent {
  eventType: EventType;
  correlationId: string;
  message:
    | OrderRequestedMsg
    | OrderCreatedMsg
    | OrderConfirmedMsg
    | PaymentSucceededMsg;
}
export interface OrderRequest {
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
export interface OrderRequestedMsg extends OrderRequest {
  orderId: string;
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

export enum EventType {
  OrderRequested = 'OrderRequested',
  OrderCreated = 'OrderCreated',
  OrderConfirmed = 'OrderConfirmed',
  PaymentSucceeded = 'PaymentSucceeded',
}
