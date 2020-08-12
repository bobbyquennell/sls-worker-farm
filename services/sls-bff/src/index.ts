import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { SagaEvent, EventType, OrderRequestedMsg, OrderRequest } from './types';
import { SNS } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export const worker = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const snsConfig: SNS.ClientConfiguration = { region: 'ap-southeast-2' };
  const sns = new SNS(snsConfig);
  const orderRequest: OrderRequest = JSON.parse(event?.body);
  const correlationId = uuidv4();
  const orderId = uuidv4();

  console.log(`bff ===> received orderRequest:`, orderRequest);
  console.log(EventType.OrderRequested);
  const sagaEvent: SagaEvent = {
    eventType: EventType.OrderRequested,
    correlationId,
    message: { ...orderRequest, orderId } as OrderRequestedMsg,
  };
  const snsMsg: SNS.PublishInput = {
    TopicArn: process.env.ORDER_TOPIC_ARN,
    Message: JSON.stringify(sagaEvent),
    MessageAttributes: {
      EventType: {
        DataType: 'String',
        StringValue: EventType.OrderRequested,
      },
    },
  };
  await sns.publish(snsMsg).promise();

  console.log(
    `correlationId: ${correlationId}, bff => published Event: ${EventType.OrderRequested}:`,
  );
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({ orderId }),
  };
  return response;
};
