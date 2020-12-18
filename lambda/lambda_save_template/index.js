const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const upsert = function(item, userId, context, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var now = new Date();
   

    function getMiraklDetails(uid, token, hostUrl) {
        return docClient.get({
            TableName: 'UserDetails',
            Key:{
                "UserId": uid
            },
        }).promise();
    }
 
    getMiraklDetails(userId).then(res => {
        if(!res.Item){
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    status: 'not_found'
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }else{
            //we found it, we just need to let the frontend know its there with a 200
            let tempMappings = res.Item.mappings
            if(!tempMappings){
                tempMappings = {};
            }

            tempMappings[item.doc_id] = item.form_fields;
            var params = {
                TableName:"UserDetails",
                Key:{
                    "UserId": userId
                },
                UpdateExpression: "set mappings = :mappings",
                ExpressionAttributeValues:{
                    ':mappings': tempMappings
                },
                ReturnValues:"UPDATED_NEW"
            };
            docClient.update(params, function(err, data) {
                if (err) {
                    console.log("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    //cant log a real token, too risky - console.log("Added item:", JSON.stringify(data, null, 2));
                }
                callback(err, data);
            });
        } 
    }).catch((err) => {
        console.error(err);
        errorResponse(err.message, context.awsRequestId, callback)
    });

    
};


exports.handler = (event, context, callback) => {
    // TODO: Decode jwt token for uid
    const userId = event.requestContext.authorizer['principalId'];

    // parse token and url
    const requestBody = JSON.parse(event.body);

    const docId = requestBody.docId;
    const formFields = requestBody.formFields;

    const newItem = {
        doc_id: docId,
        form_fields: formFields
    }

    upsert(newItem, userId, context, (err, data) => {
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