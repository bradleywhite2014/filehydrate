const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    
  // Typically this is stored alongside the authenticated user in your database.
  const {sessionId} = JSON.parse(event.body);
  const checkoutsession = await stripe.checkout.sessions.retrieve(sessionId);

  // This is the url to which the customer will be redirected when they are done
  // managign their billing with the portal.
  const returnUrl = 'https://filehydrate.com'

  const portalsession = await stripe.billingPortal.sessions.create({
    customer: checkoutsession.customer,
    return_url: returnUrl,
  });
  const response = {
      statusCode: 200,
      body: JSON.stringify('Completed Customer Portal'),
  };
  return response;
};
