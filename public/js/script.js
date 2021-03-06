const stripe = Stripe('public_key');

const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

document
  .getElementById('checkout-button')
  .addEventListener('click', async () => {
    try {
      const stripeToken = await stripe.createToken(cardElement);
      if (stripeToken.hasOwnProperty('error')) {
        throw stripeToken;
      }

      const res = await fetch('/checkout', {
        method: 'POST',
        body: JSON.stringify(stripeToken),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setTimeout(() => {
        window.location = `/success?chargeid=${data.chargeId}`;
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  });
