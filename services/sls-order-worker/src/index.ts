import { SQSEvent, SQSHandler, SNSMessage } from 'aws-lambda';
import {
  SagaEvent,
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
      const sagaEvent: SagaEvent = JSON.parse(body.Message);
      switch (sagaEvent.eventType) {
        case EventType.OrderRequested:
          return createOrder(
            sagaEvent.message as OrderRequestedMsg,
            sagaEvent.correlationId,
          );
        case EventType.PaymentSucceeded:
          return confirmOrder(
            sagaEvent.message as PaymentSucceededMsg,
            sagaEvent.correlationId,
          );
        default:
          throw new Error(
            `Order service: Unsupported saga event type received: "${sagaEvent.eventType}, correlationId: ${sagaEvent.correlationId}"`,
          );
      }
    }),
  ).catch((err) => {
    throw new Error('Order service: Failed to execute.');
  });
};
