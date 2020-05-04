const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const ddb = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {
    // if (!event.requestContext.authorizer) {
    //   errorResponse('Authorization not configured', context.awsRequestId, callback);
    //   return;
    // }

    // TODO: Decode jwt token for uid
    console.log('event');
    console.log(event);
    console.log('context');
    console.log(context);
    const userId = event.requestContext.authorizer['principalId'];

    // parse token and url
    const requestBody = event.body

    const token = requestBody.token;
    const urlHost = requestBody.host

    saveMiraklDetails(userId, token, urlHost).then(() => {
        // You can use the callback function to provide a return value from your Node.js
        // Lambda functions. The first parameter is used for failed invocations. The
        // second parameter specifies the result data of the invocation.

        // Because this Lambda function is called by an API Gateway proxy integration
        // the result object must use the following structure.
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                status: 'success'
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    }).catch((err) => {
        console.error(err);

        // If there is an error during processing, catch it and return
        // from the Lambda function successfully. Specify a 500 HTTP status
        // code and provide an error message in the body. This will provide a
        // more meaningful error response to the end client.
        errorResponse(err.message, context.awsRequestId, callback)
    });
};

function saveMiraklDetails(uid, token, hostUrl) {
    return ddb.put({
        TableName: 'UserDetails',
        Item: {
            UserId: uid,
            MiraklToken: token,
            MiraklHostUrl: hostUrl,
        },
    }).promise();
}

function toUrlString(buffer) {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}