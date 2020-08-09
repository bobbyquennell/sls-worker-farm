import { OrderCreateRequest } from './types';

export default async (body: OrderCreateRequest): Promise<void> => {
  const event = body as OrderCreateRequest;

  console.log(
    `Creating new order for ${event.customerName}, order Details: `,
    body,
  );
  console.log('order created! ');
};
