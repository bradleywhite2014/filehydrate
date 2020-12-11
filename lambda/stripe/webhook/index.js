const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let stripeEvent;
    let signature = event.headers["stripe-signature"];

    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      const response = {
        statusCode: 400,
        body: JSON.stringify('Webhook signature verification failed.'),
      };
      return response;
    }
    // Extract the object from the event.
    var data = stripeEvent.data;
    eventType = stripeEvent.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    var data = JSON.parse(event.body).data;
    eventType = JSON.parse(event.body).type;
  }

  if (eventType === "checkout.session.completed") {
    console.log(`🔔  Payment received!`);
  }

  const response = {
      statusCode: 200,
      body: JSON.stringify('Completed webhook listener'),
  };
  return response;
};
