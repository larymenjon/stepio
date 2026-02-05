# Stepio Billing Server (Stripe Checkout)

## Variáveis de ambiente

Configure estas variáveis no host (Render) e no local (arquivo `.env` separado para o servidor):

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...
APP_URL=http://localhost:8080
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

## Firebase service account

No Firebase Console:
- Project Settings → Service accounts → Generate new private key
- Copie o JSON e use em `FIREBASE_SERVICE_ACCOUNT` (em uma linha).

## Rodar local

```
npm install
npm run dev:server
```

## Webhook Stripe

Depois de subir o servidor, configure o webhook no Stripe:

- URL: `https://SEU_SERVIDOR/webhook`
- Eventos:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

Copie o `whsec_...` para `STRIPE_WEBHOOK_SECRET`.
