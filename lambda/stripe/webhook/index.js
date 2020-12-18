const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const ddb = new AWS.DynamoDB.DocumentClient();

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const upsert = function(userId, subType, callback) {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var now = new Date();
  var params = {
      TableName:"UserDetails",
      Key:{
          "UserId": userId
      },
      UpdateExpression: "set sub_status = :sub_status, sub_type = :sub_type",
      ExpressionAttributeValues:{
          ':sub_status':'active',
          ':sub_type': subType
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

const paymentSucceeded = async (dataObject, callback) => {
  const customerID = dataObject['customer'];
  if (!customerID) {
    throw Error(`No customer with ID "${customerID}"`);
  }
  const customerEmail = dataObject['customer_email'];
  const customerName = dataObject['customer_name'];
  const linkToInvoice = dataObject['hosted_invoice_url'];
  const paymentId = dataObject['plan']['id']
  let subType = 'basic'

  if(paymentId === 'price_1Hx5RjAt5lSr2FnXLve6p3YP'){
    subType = 'pro'
  }
  

  getUserDetails(customerID).then(async (res) => {
    if(res.Items.length !== 1){
      throw Error('odd customer id list')
    }else{
      upsert(res.Items[0].UserId, subType, (err, data) => {
        if(err){
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    status: 'error',
                    message: "Did not activate successfully."
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }else{
          callback(null, {
            statusCode: 200,
            body: JSON.stringify({
              sub_status: 'active',
              sub_type: subType
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
          });
        }
      });
    }
  });
  // Use the above to send confirmation email with a link to invoice,
  // thus enabling the paid functionality.
};

const paymentFailed = async (dataObject, callback) => {
  // ...This is more or less identical with the paymentSucceeded function above.
  // Send an email notifying about the failed payment.
};

const subscriptionDeleted = async (dataObject, callback) => {
  // ...This is more or less identical with the paymentSucceeded function above.
  // Send an email confirming that there subscription has now ended.
};

const handlerMapping= {
  'customer.subscription.created': paymentSucceeded,
  'invoice.payment_failed': paymentFailed,
  'customer.subscription.deleted': subscriptionDeleted,
};

function getUserDetails(stripeId) {
  var params = {
    KeyConditionExpression: 'StripeId = :stripe_id',
    ExpressionAttributeValues: {
        ':stripe_id': stripeId
    },
    TableName: 'UserDetails',
    IndexName: 'StripeId-index'
  };
  
  return ddb.query(params).promise();
}

exports.handler = async (event, context, callback) => {
  if (!event.body) {
    callback(Error('Invalid body'));
    return;
  }
  try {
    // We validate that the event is coming from an
    // authentic Stripe origin
    const webhookEvent = stripe.webhooks.constructEvent(
      event.body,
      event.headers['Stripe-Signature'],
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    // Pull out the data object (customer, invoice, etc...)
    const dataObject = webhookEvent.data.object;
    // Get the corrosponding handler from the handlerMapping above
    const handler = handlerMapping[webhookEvent.type];
    if (!handler) {
      callback(null, {
        statusCode: 400,
        body: 'Unexpected event type',
      });
      return;
    }
    await handler(dataObject, callback);
    callback(null, {
      statusCode: 200,
    });
  } catch (error) {
    callback(error);
  }
};
