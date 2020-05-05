const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const upsert = function(item, userId, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var now = new Date();
    var params = {
        TableName:"UserDetails",
        Key:{
            "UserId": userId
        },
        UpdateExpression: "set mirakl_host = :mirakl_host, mirakl_token = :mirakl_token",
        ConditionExpression: "attribute_not_exists(mirakl_host) OR mirakl_host = :mirakl_host",
        ExpressionAttributeValues:{
            ':mirakl_host':item.mirakl_host,
            ':mirakl_token':item.mirakl_token
        },
        ReturnValues:"UPDATED_NEW"
    };
 
    console.log("Adding a new item...");
    console.log(JSON.stringify(item, null, 2));
    docClient.update(params, function(err, data) {
        if (err) {
            console.log("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            //cant log a real token, too risky - console.log("Added item:", JSON.stringify(data, null, 2));
        }
        callback(err, data);
    });
};


exports.handler = (event, context, callback) => {
    // TODO: Decode jwt token for uid
    const userId = event.requestContext.authorizer['principalId'];

    // parse token and url
    const requestBody = JSON.parse(event.body);

    const token = requestBody.token;
    const urlHost = requestBody.url;

    const newItem = {
        mirakl_host: urlHost,
        mirakl_token: token
    }

    console.log('is it there????' + JSON.stringify(newItem))

    upsert(newItem, userId, (err, data) => {
        if(err){
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    status: 'error',
                    message: "Did not upsert successfully."
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                status: 'success'
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    });
        
};


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