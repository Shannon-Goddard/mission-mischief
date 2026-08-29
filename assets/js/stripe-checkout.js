/**
 * Mission Mischief - Stripe Checkout
 * Redirects to Stripe hosted checkout for Mayhem's Key
 */

const StripeCheckout = {
  PUBLISHABLE_KEY: 'pk_test_51U5EUFE8Hd43F6H7UMVb320rflTw05IaQBRDpPwUv1XF6WVuSIu6k7pF6h2MxXZ83t4annQUYW1i4eu8YGoKmgEp00lj0aLecX',
  PRICE_ID: 'price_1U9tOOE8Hd43F6H7hBgR6rRn',
  SUCCESS_URL: 'https://missionmischief.online/unlock.html?session_id={CHECKOUT_SESSION_ID}',
  CANCEL_URL: 'https://missionmischief.online/',

  async redirectToCheckout() {
    const btn = document.getElementById('buyBtn');
    if (btn) {
      btn.textContent = 'Loading...';
      btn.disabled = true;
    }

    try {
      const stripe = Stripe(this.PUBLISHABLE_KEY);
      await stripe.redirectToCheckout({
        lineItems: [{ price: this.PRICE_ID, quantity: 1 }],
        mode: 'payment',
        successUrl: this.SUCCESS_URL,
        cancelUrl: this.CANCEL_URL,
        billingAddressCollection: 'auto'
      });
    } catch (err) {
      console.error('Stripe checkout failed:', err);
      if (btn) {
        btn.textContent = '🍺 GET MAYHEM\'S KEY — $4.99';
        btn.disabled = false;
      }
      alert('Checkout failed. Please try again.');
    }
  }
};

window.StripeCheckout = StripeCheckout;
