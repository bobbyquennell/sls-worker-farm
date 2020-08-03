import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

let response;

exports.worker = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const inboundMsg = JSON.parse(event?.body);
    console.log(
      `sls-payment-worker ===> received payment request: ${inboundMsg?.paymentRequest}`,
    );

    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: `Payment Success`,
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
