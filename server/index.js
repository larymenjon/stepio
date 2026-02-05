import "dotenv/config";
import express from "express";
import cors from "cors";
import Stripe from "stripe";
import admin from "firebase-admin";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4242;
const APP_URL = process.env.APP_URL || "http://localhost:8080";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const priceMonthly = process.env.STRIPE_PRICE_MONTHLY;
const priceYearly = process.env.STRIPE_PRICE_YEARLY;

if (!stripeSecret) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;
  if (!serviceAccount) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT");
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const app = express();

app.use(
  cors({
    origin: [APP_URL],
    methods: ["GET", "POST"],
    credentials: false,
  }),
);

app.use((req, _res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, _res, next);
  }
});

async function getUserFromAuth(req) {
  const authHeader = req.headers.authorization || "";
  const [, token] = authHeader.split(" ");
  if (!token) return null;
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded;
  } catch {
    return null;
  }
}

async function getOrCreateCustomer(uid, email) {
  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();
  const userData = userSnap.data() || {};
  if (userData.stripeCustomerId) return userData.stripeCustomerId;

  const customer = await stripe.customers.create({
    email,
    metadata: { uid },
  });

  await userRef.set({ stripeCustomerId: customer.id }, { merge: true });
  return customer.id;
}

app.post("/api/billing/create-checkout-session", async (req, res) => {
  const authUser = await getUserFromAuth(req);
  if (!authUser) {
    return res.status(401).send("Unauthorized");
  }

  const { priceId } = req.body || {};
  if (!priceId) return res.status(400).send("Missing priceId");

  const customerId = await getOrCreateCustomer(authUser.uid, authUser.email);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${APP_URL}/pagamento/sucesso`,
    cancel_url: `${APP_URL}/pagamento/cancelado`,
    metadata: {
      uid: authUser.uid,
    },
  });

  return res.json({ url: session.url });
});

app.post("/api/billing/create-portal-session", async (req, res) => {
  const authUser = await getUserFromAuth(req);
  if (!authUser) {
    return res.status(401).send("Unauthorized");
  }

  const userRef = db.collection("users").doc(authUser.uid);
  const userSnap = await userRef.get();
  const userData = userSnap.data() || {};
  if (!userData.stripeCustomerId) {
    return res.status(400).send("Customer not found");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: userData.stripeCustomerId,
    return_url: `${APP_URL}/planos`,
  });

  return res.json({ url: session.url });
});

app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  if (!webhookSecret) {
    return res.status(200).send("Webhook disabled");
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = event.data.object;

  const handleUpdate = async (subscription) => {
    const customerId = subscription.customer;
    const status = subscription.status;
    const priceId = subscription.items?.data?.[0]?.price?.id;
    const tier =
      priceId === priceMonthly || priceId === priceYearly ? "pro" : "free";

    const users = await db.collection("users").where("stripeCustomerId", "==", customerId).get();
    for (const doc of users.docs) {
      await doc.ref.set(
        {
          plan: {
            tier,
            status,
            renewalDate: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null,
          },
        },
        { merge: true },
      );
    }
  };

  if (event.type === "checkout.session.completed") {
    const session = data;
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      await handleUpdate(subscription);
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    await handleUpdate(data);
  }

  return res.json({ received: true });
});

app.listen(PORT, () => {
  console.log(`[stepio] billing server running on http://localhost:${PORT}`);
});
