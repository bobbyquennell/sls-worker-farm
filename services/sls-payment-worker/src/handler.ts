import {
  EventType,
  OrderEvent,
  PaymentSucceededMsg,
  OrderCreatedMsg,
} from './types';
import { SNS } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export default async (event: OrderCreatedMsg): Promise<void> => {
  const snsConfig: SNS.ClientConfiguration = { region: 'ap-southeast-2' };
  const sns = new SNS(snsConfig);
  console.log(`charging for order:  ${event.orderId}`);
  console.log(`payment  succeeded for order ${event.orderId}! `);
  const paymentId = uuidv4();
  console.log(`insert payment record: paymentId ${paymentId}`);

  const PaymentSucceeded: SNS.PublishInput = {
    TopicArn: process.env.ORDER_TOPIC_ARN,
    Message: JSON.stringify({
      eventType: EventType.PaymentSucceeded,
      message: {
        orderId: event.orderId,
        paymentId,
      } as PaymentSucceededMsg,
    } as OrderEvent),
    MessageAttributes: {
      EventType: {
        DataType: 'String',
        StringValue: EventType.PaymentSucceeded,
      },
    },
  };
  console.log(`order paid: ${event.orderId}`);
  await sns.publish(PaymentSucceeded).promise();
};
