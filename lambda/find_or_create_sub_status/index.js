const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const ddb = new AWS.DynamoDB.DocumentClient();

//init stripe
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const upsert = function(userId, stripeId, callback) {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var now = new Date();
  var params = {
      TableName:"UserDetails",
      Key:{
          "UserId": userId
      },
      UpdateExpression: "set sub_status = :sub_status,sub_type = :sub_type, StripeId = :StripeId",
      ExpressionAttributeValues:{
          ':sub_status':'inactive',
          ':sub_type': 'free',
          ':StripeId': stripeId
      },
      ReturnValues:"UPDATED_NEW"
  };

  console.log("Adding a new customer...");
  docClient.update(params, function(err, data) {
      if (err) {
          console.log("Unable to add customer. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          //cant log a real token, too risky - console.log("Added item:", JSON.stringify(data, null, 2));
      }
      callback(err, data);
  });
};


exports.handler = (event, context, callback) => {
    const userId = event.requestContext.authorizer['principalId'];


    getUserDetails(userId).then(async (res) => {
        if(!res.Item){
            //user does not exist, need to create
            //creating generic, i dont need to tie to email because i will in db
            const customer = await stripe.customers.create();
            upsert(userId, customer.id, (err, data) => {
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
              }else{
                callback(null, {
                  statusCode: 200,
                  body: JSON.stringify({
                    sub_status: res.Item.sub_status,
                    sub_type: res.Item.sub_type
                  }),
                  headers: {
                      'Access-Control-Allow-Origin': '*',
                  },
              });
            }
          });
        }else{
            //we found it, we just need to let the frontend know its there with a 200
            if(!res.Item.StripeId){
              //we have this user but no stripe customer, lets get it created
              const customer = await stripe.customers.create();
              upsert(userId, customer.id, (err, data) => {
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
                }else{
                  callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({
                      sub_status: 'inactive',
                      sub_type: 'free'
                    }),
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                  });
                }
              });
            }else{
              //we have an existing customer, just return the status
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({
                        sub_status: res.Item.sub_status,
                        sub_type: res.Item.sub_type
                    }),
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                });
            }
        } 
    }).catch((err) => {
        console.error(err);
        errorResponse(err.message, context.awsRequestId, callback)
    });
};

function getUserDetails(uid, token, hostUrl) {
    return ddb.get({
        TableName: 'UserDetails',
        Key:{
            "UserId": uid
        },
    }).promise();
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