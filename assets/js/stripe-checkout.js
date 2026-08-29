/**
 * Mission Mischief - Stripe Checkout
 * Creates a server-side checkout session then redirects
 */

const StripeCheckout = {
  API: 'https://4q1ybupwm0.execute-api.us-east-1.amazonaws.com/prod',

  async redirectToCheckout() {
    const btn = document.getElementById('buyBtn');
    if (btn) { btn.textContent = 'Loading...'; btn.disabled = true; }

    try {
      const res = await fetch(`${this.API}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'No checkout URL returned');
      }
    } catch (err) {
      console.error('Stripe checkout failed:', err);
      if (btn) { btn.textContent = '🍺 GET MAYHEM\'S KEY — $4.99'; btn.disabled = false; }
      alert('Checkout failed. Please try again.');
    }
  }
};

window.StripeCheckout = StripeCheckout;
