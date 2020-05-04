const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const ddb = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {
    const userId = event.requestContext.authorizer['principalId'];


    getMiraklDetails(userId).then((err, data) => {

    //we found it, we just need to let the frontend know its there with a 200
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                status: 'found'
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    }).catch((err) => {
        console.error(err);
        errorResponse(err.message, context.awsRequestId, callback)
    });
};

function getMiraklDetails(uid, token, hostUrl) {
    return ddb.get({
        TableName: 'UserDetails',
        Key:{
            "UserId": uid
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