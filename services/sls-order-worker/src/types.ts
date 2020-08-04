export interface OrderEvent {
  eventType: OrderEventType;
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
export enum OrderEventType {
  OrderRequested,
}
