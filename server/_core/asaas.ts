const ASAAS_BASE = process.env.ASAAS_SANDBOX === "true"
  ? "https://sandbox.asaas.com/api/v3"
  : "https://api.asaas.com/v3";

const ASAAS_KEY = process.env.ASAAS_API_KEY ?? "";

async function asaasRequest<T>(
  method: "GET" | "POST" | "DELETE",
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${ASAAS_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      access_token: ASAAS_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json() as T;

  if (!res.ok) {
    const msg = (data as { errors?: { description: string }[] }).errors?.[0]?.description ?? "Erro no Asaas";
    throw new Error(msg);
  }

  return data;
}

/* ─── Customers ─── */
export interface AsaasCustomer {
  id: string;
  name: string;
  cpfCnpj?: string;
  email?: string;
  phone?: string;
}

export async function findOrCreateCustomer(params: {
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
}): Promise<AsaasCustomer> {
  if (params.email) {
    const search = await asaasRequest<{ data: AsaasCustomer[] }>(
      "GET",
      `/customers?email=${encodeURIComponent(params.email)}`
    );
    if (search.data.length > 0) return search.data[0];
  }

  return asaasRequest<AsaasCustomer>("POST", "/customers", {
    name: params.name,
    email: params.email,
    cpfCnpj: params.cpfCnpj,
    phone: params.phone,
  });
}

/* ─── Payments ─── */
export type AsaasPaymentMethod = "PIX" | "BOLETO" | "CREDIT_CARD";

export interface AsaasPayment {
  id: string;
  status: "PENDING" | "RECEIVED" | "CONFIRMED" | "OVERDUE" | "REFUNDED" | "DELETED" | "CANCELLED";
  invoiceUrl: string;
  bankSlipUrl?: string;
  pixQrCodeImage?: string;
  pixCopiaECola?: string;
  nossoNumero?: string;
  dueDate: string;
}

export interface CreatePaymentParams {
  customerId: string;
  billingType: AsaasPaymentMethod;
  value: number;
  dueDate: string;
  description: string;
  externalReference?: string;
}

export async function createPayment(params: CreatePaymentParams): Promise<AsaasPayment> {
  const payment = await asaasRequest<AsaasPayment>("POST", "/payments", {
    customer: params.customerId,
    billingType: params.billingType,
    value: params.value,
    dueDate: params.dueDate,
    description: params.description,
    externalReference: params.externalReference,
  });

  if (params.billingType === "PIX") {
    const pix = await asaasRequest<{ encodedImage: string; payload: string }>(
      "GET",
      `/payments/${payment.id}/pixQrCode`
    ).catch(() => null);

    if (pix) {
      payment.pixQrCodeImage = pix.encodedImage;
      payment.pixCopiaECola = pix.payload;
    }
  }

  return payment;
}

export async function getPayment(paymentId: string): Promise<AsaasPayment> {
  return asaasRequest<AsaasPayment>("GET", `/payments/${paymentId}`);
}

/* ─── Status mapper ─── */
export function mapAsaasStatus(
  asaasStatus: AsaasPayment["status"]
): "pending" | "paid" | "cancelled" | "refunded" {
  switch (asaasStatus) {
    case "RECEIVED":
    case "CONFIRMED":
      return "paid";
    case "REFUNDED":
      return "refunded";
    case "DELETED":
    case "CANCELLED":
      return "cancelled";
    default:
      return "pending";
  }
}
