const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    
  const domainURL = 'https://filehydrate.com';
  const { priceId } = JSON.parse(event.body);

  // Create new Checkout Session for the order
  // Other optional params include:
  // [billing_address_collection] - to display billing address details on the page
  // [customer] - if you have an existing Stripe Customer ID
  // [customer_email] - lets you prefill the email input in the form
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
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
      body: {
        sessionId: session.id,
      },
    };
    return response;
  } catch (e) {
    const response = {
      statusCode: 400,
      body: JSON.stringify('Bad Request.'),
    };
    return response;
  }
};
