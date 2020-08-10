import {
  OrderRequestedMsg,
  EventType,
  OrderEvent,
  OrderCreatedMsg,
  PaymentSucceededMsg,
  OrderConfirmedMsg,
} from './types';
import { SNS } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export default async (event: OrderRequestedMsg): Promise<void> => {
  const snsConfig: SNS.ClientConfiguration = { region: 'ap-southeast-2' };
  const sns = new SNS(snsConfig);
  const orderId = uuidv4();
  console.log(
    `insert new order into database for ${event.customerName}, order Details: `,
    event,
  );

  const orderCreated: SNS.PublishInput = {
    TopicArn: process.env.ORDER_TOPIC_ARN,
    Message: JSON.stringify({
      eventType: EventType.OrderCreated,
      message: { orderId, paymentToken: uuidv4() } as OrderCreatedMsg,
    } as OrderEvent),
    MessageAttributes: {
      EventType: {
        DataType: 'String',
        StringValue: EventType.OrderCreated,
      },
    },
  };
  console.log(`order created! ${orderId}`);
  await sns.publish(orderCreated).promise();
};

export const confirmOrder = async (
  event: PaymentSucceededMsg,
): Promise<void> => {
  const snsConfig: SNS.ClientConfiguration = { region: 'ap-southeast-2' };
  const sns = new SNS(snsConfig);
  console.log(`update order:  ${event.orderId} to confirmed status: `, event);

  const orderConfirmed: SNS.PublishInput = {
    TopicArn: process.env.ORDER_TOPIC_ARN,
    Message: JSON.stringify({
      eventType: EventType.OrderConfirmed,
      message: {
        orderId: event.orderId,
      } as OrderConfirmedMsg,
    } as OrderEvent),
    MessageAttributes: {
      EventType: {
        DataType: 'String',
        StringValue: EventType.OrderConfirmed,
      },
    },
  };
  console.log(`order confirmed! ${event.orderId}`);
  await sns.publish(orderConfirmed).promise();
};
