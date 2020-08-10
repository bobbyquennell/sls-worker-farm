import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { OrderEvent, EventType, OrderRequestedMsg } from './types';
import { SNS } from 'aws-sdk';

export const worker = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const snsConfig: SNS.ClientConfiguration = { region: 'ap-southeast-2' };
  const sns = new SNS(snsConfig);
  const orderRequest: OrderRequestedMsg = JSON.parse(event?.body);

  console.log('sls-bff ===> orderRequest:', orderRequest);
  console.log(EventType.OrderRequested);
  const orderEvent: SNS.PublishInput = {
    TopicArn: process.env.ORDER_TOPIC_ARN,
    Message: JSON.stringify({
      eventType: EventType.OrderRequested,
      message: orderRequest,
    } as OrderEvent),
    MessageAttributes: {
      EventType: {
        DataType: 'String',
        StringValue: EventType.OrderRequested,
      },
    },
  };
  await sns.publish(orderEvent).promise();

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({ orderId: 'asd123' }),
  };
  return response;
};
