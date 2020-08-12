import { SQSEvent, SQSHandler, SNSMessage } from 'aws-lambda';
import { SagaEvent, EventType, OrderCreatedMsg } from './types';
import paymentHandler from './handler';

export const worker: SQSHandler = async (event: SQSEvent): Promise<void> => {
  const bodies: SNSMessage[] = event.Records.map((record) =>
    JSON.parse(record.body),
  );

  await Promise.all(
    bodies.map((body) => {
      const sagaEvent: SagaEvent = JSON.parse(body.Message);
      switch (sagaEvent.eventType) {
        case EventType.OrderCreated:
          return paymentHandler(
            sagaEvent.message as OrderCreatedMsg,
            sagaEvent.correlationId,
          );
        default:
          throw new Error(
            `Payment service: Unsupported saga event type received: "${sagaEvent.eventType}, correlationId: ${sagaEvent.correlationId}"`,
          );
      }
    }),
  ).catch((err) => {
    throw new Error('Payment service: Failed to execute.');
  });
};
