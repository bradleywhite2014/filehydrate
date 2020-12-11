const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  let sessionId = ''
  if(event && event.query && event.query.sessionId){
    sessionId = event.query.sessionId
  }
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return session;
  
};
