import { SQSEvent, SQSRecord, SQSHandler } from 'aws-lambda';
import { OrderEvent, OrderEventType } from './types';
import orderHandler from './handler';
export const worker: SQSHandler = async (message: SQSEvent): Promise<void> => {
  const parser = (record: SQSRecord): OrderEvent => {
    return JSON.parse(record.body);
  };
  const bodies: OrderEvent[] = message.Records.map(parser);
  await Promise.all(
    bodies.map((body: OrderEvent) => {
      switch (body.eventType) {
        case OrderEventType.OrderRequested:
          return orderHandler(body);
        default:
          throw new Error(
            `Unsupported event type received: "${body.eventType}"`,
          );
      }
    }),
  ).catch((err) => {
    throw new Error('Failed to execute.');
  });
};
