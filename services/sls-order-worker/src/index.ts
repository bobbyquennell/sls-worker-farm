import { SQSEvent, SQSHandler, SNSMessage } from 'aws-lambda';
import {
  OrderEvent,
  EventType,
  OrderRequestedMsg,
  PaymentSucceededMsg,
} from './types';
import createOrder, { confirmOrder } from './handler';

export const worker: SQSHandler = async (event: SQSEvent): Promise<void> => {
  const bodies: SNSMessage[] = event.Records.map((record) =>
    JSON.parse(record.body),
  );

  await Promise.all(
    bodies.map((body) => {
      const orderMessage: OrderEvent = JSON.parse(body.Message);
      switch (orderMessage.eventType) {
        case EventType.OrderRequested:
          return createOrder(orderMessage.message as OrderRequestedMsg);
        case EventType.PaymentSucceeded:
          return confirmOrder(orderMessage.message as PaymentSucceededMsg);
        default:
          throw new Error(
            `Unsupported event type received: "${orderMessage.eventType}"`,
          );
      }
    }),
  ).catch((err) => {
    throw new Error('Failed to execute.');
  });
};
