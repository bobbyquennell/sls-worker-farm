import { OrderEvent } from './types';

export default async (body: OrderEvent): Promise<void> => {
  const event = body as OrderEvent;

  console.log(`Creating new order for ${event.customerName}`);
  console.log('order created! ');
};
