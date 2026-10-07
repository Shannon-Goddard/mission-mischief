# Session Summary — Stripe Integration + Cleanup

## ✅ What We Built Tonight
- Stripe hosted checkout via server-side session creation (Lambda)
- `MAYHEM-XXXX-XXXX-XXXX` key generation on payment
- Keys stored in DynamoDB `mission-mischief-users` table
- `unlock.html` auto-retrieves key via `?session_id=` param
- Removed badge overlay system — replaced with hashtag copy button
- Jail clown selfie simplified — static image download instead of canvas overlay
- Bottom nav working across all pages

---

## 🔧 Outstanding Items

### 1. Re-enable Stripe Webhook Signature Verification
Signature verification is currently **disabled** in `stripe-webhook-lambda.py`.
The `handle_webhook` function has this comment:
```python
# Skip signature verification — log raw header for debugging
logger.info(f"Stripe-Signature header: {sig_header[:50] if sig_header else 'MISSING'}")
```
Replace with proper verification before going live. Amazon Q can do this — just ask.

### 2. Go Live with Real Stripe Keys
When ready to accept real payments:
- Create a **live webhook** in Stripe Dashboard (not sandbox)
  - URL: `https://4q1ybupwm0.execute-api.us-east-1.amazonaws.com/prod/webhook`
  - Event: `checkout.session.completed`
  - Copy the live `whsec_...`
- Get live `price_id` from Stripe → Products → Mayhem's Key (live mode)
- Update AWS Secrets Manager:
```
aws secretsmanager update-secret --secret-id mission-mischief/stripe --secret-string file://stripe-secret.json
```
With contents:
```json
{
  "secret_key": "sk_live_...",
  "webhook_secret": "whsec_LIVE_SECRET",
  "price_id": "price_LIVE_PRICE_ID"
}
```
Delete the file immediately after running.

### 3. Fix Deprecated Meta Tag
Every game page shows this console warning:
```
<meta name="apple-mobile-web-app-capable" content="yes"> is deprecated.
Please include <meta name="mobile-web-app-capable" content="yes">
```
Needs to be added/replaced across all pages. Amazon Q can audit and fix all at once.

### 4. Create Clown Redemption Image
Jail page (Step 3) downloads from:
```
assets/images/ui/clown-redemption.png
```
This file doesn't exist yet. Create a funny clown image and save it there.

### 5. Push Current Changes
All changes from tonight are ready to push:
- `assets/js/stripe-checkout.js` — server-side checkout
- `assets/js/direct-submission.js` — redirects to missions after submit
- `BUILD_ARTIFACTS/stripe-webhook-lambda.py` — full Stripe Lambda
- `pages/missions/missions-page.js` — Copy Hashtags replaces Upload Proof
- `pages/missions/index.html` — cleaned up JS imports
- `pages/jail/jail.js` — simplified clown download
- `pages/jail/index.html` — no more file upload in Step 3
- `core-game-files/funny-tos.html` — back button removed
- `core-game-files/badge-overlay.html` — DELETED
- `sw.js` — v6, badge-overlay removed, Stripe passthrough, no duplicate storage.js
- `index.html` — Stripe button replaces Lemon Squeezy link
- `unlock.html` — handles `?session_id=`, Stripe checkout link
- `.gitignore` — added stripe-secret.json, temp-file.text, prices.csv

---

## 🔑 Key Info

| Item | Value |
|------|-------|
| API Gateway ID | `4q1ybupwm0` |
| Lambda function | `mission-mischief-license` |
| DynamoDB table | `mission-mischief-users` |
| DynamoDB partition key | `licenseKey` (camelCase) |
| Secrets Manager | `mission-mischief/stripe` |
| Sandbox webhook ID | `we_1U9uibE4BcLmtuH4YcyWlUY4` |
| Live webhook | Not created yet |
| Test key in DB | `TEST-KEY-1234` |

---

## 🍺 Lemon Squeezy
They said no. Their loss. Stripe works great.
