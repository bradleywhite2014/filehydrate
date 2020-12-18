const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const ddb = new AWS.DynamoDB.DocumentClient();

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
      UpdateExpression: "set sub_status = :sub_status, StripeId = :StripeId",
      ExpressionAttributeValues:{
          ':sub_status':'inactive',
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
        upsert(userId, customer.id, async (err, data) => {
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
          const domainURL = 'https://filehydrate.com';
          const { priceId } = JSON.parse(event.body);

          // Create new Checkout Session for the brand new user
          try {
            const session = await stripe.checkout.sessions.create({
              mode: "subscription",
              customer: customer.id,
              payment_method_types: ["card"],
              line_items: [
                {
                  price: priceId,
                  quantity: 1,
                },
              ],
              // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
              success_url: `${domainURL}?stripe_status=success&session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${domainURL}?stripe_status=cancelled`,
            });
            const response = {
              statusCode: 200,
              body: JSON.stringify({
                sessionId: session.id,
              }),
            };
            callback(null, response);
          } catch (e) {
            console.log('Error in stripe session creation - ' + e)
            const response = {
              statusCode: 400,
              body: JSON.stringify('Bad Request.'),
            };
            callback(null, response);
          }
        }
      });
    }else{
        //we found it, we just need to let the frontend know its there with a 200
        if(!res.Item.StripeId){
          //we have this user but no stripe customer, lets get it created
          const customer = await stripe.customers.create();
          upsert(userId, customer.id, async (err, data) => {
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
              const domainURL = 'https://filehydrate.com';
              const { priceId } = JSON.parse(event.body);

              // Create new Checkout Session for the brand new user
              try {
                const session = await stripe.checkout.sessions.create({
                  mode: "subscription",
                  customer: customer.id,
                  payment_method_types: ["card"],
                  line_items: [
                    {
                      price: priceId,
                      quantity: 1,
                    },
                  ],
                  // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
                  success_url: `${domainURL}?stripe_status=success&session_id={CHECKOUT_SESSION_ID}`,
                  cancel_url: `${domainURL}?stripe_status=cancelled`,
                });
                const response = {
                  statusCode: 200,
                  body: JSON.stringify({
                    sessionId: session.id,
                  }),
                };
                callback(null, response);
              } catch (e) {
                console.log('Error in stripe session creation - ' + e)
                const response = {
                  statusCode: 400,
                  body: JSON.stringify('Bad Request.'),
                };
                return response;
              }
            }
          });
        }else{
          const domainURL = 'https://filehydrate.com';
          const { priceId } = JSON.parse(event.body);

          // Create new Checkout Session for the brand new user
          try {
            const session = await stripe.checkout.sessions.create({
              mode: "subscription",
              customer: res.Item.StripeId,
              payment_method_types: ["card"],
              line_items: [
                {
                  price: priceId,
                  quantity: 1,
                },
              ],
              // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
              success_url: `${domainURL}?stripe_status=success&session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${domainURL}?stripe_status=cancelled`,
            });
            const response = {
              statusCode: 200,
              body: JSON.stringify({
                sessionId: session.id,
              }),
            };
            callback(null, response);
          } catch (e) {
            console.log('Error in stripe session creation - ' + e)
            const response = {
              statusCode: 400,
              body: JSON.stringify('Bad Request.'),
            };
            callback(null, response);
          }
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