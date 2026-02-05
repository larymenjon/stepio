import { auth } from "@/lib/firebase";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";

const BILLING_BASE = import.meta.env.VITE_BILLING_URL ?? "http://localhost:4242";

async function authHeader() {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function createCheckoutSession(priceId: string) {
  const headers = {
    "Content-Type": "application/json",
    ...(await authHeader()),
  };
  const response = await fetch(`${BILLING_BASE}/api/billing/create-checkout-session`, {
    method: "POST",
    headers,
    body: JSON.stringify({ priceId }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Erro ao iniciar pagamento.");
  }

  const data = await response.json();
  const url = data.url as string;
  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url });
  }
  return url;
}

export async function createPortalSession() {
  const headers = {
    "Content-Type": "application/json",
    ...(await authHeader()),
  };
  const response = await fetch(`${BILLING_BASE}/api/billing/create-portal-session`, {
    method: "POST",
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Erro ao abrir portal.");
  }

  const data = await response.json();
  const url = data.url as string;
  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url });
  }
  return url;
}
