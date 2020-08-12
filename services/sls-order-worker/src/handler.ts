import {
  OrderRequestedMsg,
  EventType,
  SagaEvent,
  OrderCreatedMsg,
  PaymentSucceededMsg,
  OrderConfirmedMsg,
} from './types';
import { SNS } from 'aws-sdk';

export default async (
  event: OrderRequestedMsg,
  correlationId: string,
): Promise<void> => {
  console.log(
    `correlationId: ${correlationId}, order service => received Event: ${EventType.OrderRequested}:`,
  );
  const snsConfig: SNS.ClientConfiguration = { region: 'ap-southeast-2' };
  const sns = new SNS(snsConfig);
  console.log(
    `insert new order into database for ${event.customerName}, order Details: `,
    event,
  );

  const orderCreated: SNS.PublishInput = {
    TopicArn: process.env.ORDER_TOPIC_ARN,
    Message: JSON.stringify({
      eventType: EventType.OrderCreated,
      correlationId,
      message: {
        orderId: event.orderId,
        paymentToken: event.paymentToken,
      } as OrderCreatedMsg,
    } as SagaEvent),
    MessageAttributes: {
      EventType: {
        DataType: 'String',
        StringValue: EventType.OrderCreated,
      },
    },
  };
  console.log(`order created! ${event.orderId}`);
  await sns.publish(orderCreated).promise();
  console.log(
    `correlationId: ${correlationId}, order service => published Event: ${EventType.OrderCreated}:`,
  );
};

export const confirmOrder = async (
  event: PaymentSucceededMsg,
  correlationId: string,
): Promise<void> => {
  console.log(
    `correlationId: ${correlationId}, order service => received Event: ${EventType.PaymentSucceeded}:`,
  );
  const snsConfig: SNS.ClientConfiguration = { region: 'ap-southeast-2' };
  const sns = new SNS(snsConfig);
  console.log(
    `update order status:  confirmed, orderId: ${event.orderId}`,
    event,
  );

  const orderConfirmed: SNS.PublishInput = {
    TopicArn: process.env.ORDER_TOPIC_ARN,
    Message: JSON.stringify({
      eventType: EventType.OrderConfirmed,
      correlationId,
      message: {
        orderId: event.orderId,
      } as OrderConfirmedMsg,
    } as SagaEvent),
    MessageAttributes: {
      EventType: {
        DataType: 'String',
        StringValue: EventType.OrderConfirmed,
      },
    },
  };
  console.log(`order confirmed! ${event.orderId}`);
  await sns.publish(orderConfirmed).promise();
  console.log(
    `correlationId: ${correlationId}, order service => published Event: ${EventType.OrderConfirmed}:`,
  );
};
