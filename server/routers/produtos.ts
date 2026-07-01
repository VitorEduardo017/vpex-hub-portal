import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { eq, and, asc } from "drizzle-orm";
import { products, purchases } from "../../drizzle/schema";
import { getDb } from "../db";
import {
  findOrCreateCustomer,
  createPayment,
  getPayment,
  mapAsaasStatus,
} from "../_core/asaas";

function dueDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export const produtosRouter = router({
  /* ─── Lista produtos públicos do catálogo ─── */
  listar: publicProcedure
    .input(z.object({
      type: z.enum(["ebook", "mentoria", "servico", "ferramenta"]).optional(),
      segment: z.enum(["varejo", "agro", "industria", "franquia", "todos"]).optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return mockProducts;

      const rows = await db
        .select()
        .from(products)
        .where(and(
          eq(products.isActive, true),
          input?.type ? eq(products.type, input.type) : undefined,
          input?.segment ? eq(products.segment, input.segment) : undefined,
        ))
        .orderBy(asc(products.sortOrder), asc(products.id));

      return rows.length > 0 ? rows : mockProducts;
    }),

  /* ─── Minhas compras (autenticado) ─── */
  minhasCompras: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select({ purchase: purchases, product: products })
      .from(purchases)
      .innerJoin(products, eq(purchases.productId, products.id))
      .where(eq(purchases.userId, ctx.user.id));
  }),

  /* ─── Inicia compra via Asaas ─── */
  comprar: protectedProcedure
    .input(z.object({
      productId: z.number(),
      paymentMethod: z.enum(["pix", "boleto", "credit_card"]),
      cpfCnpj: z.string().optional(),
      phone: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();

      const productRow = db
        ? (await db.select().from(products).where(eq(products.id, input.productId)).limit(1))[0]
        : mockProducts.find((p) => p.id === input.productId);

      if (!productRow) throw new Error("Produto não encontrado");
      if (!productRow.isActive) throw new Error("Produto indisponível");

      const asaasKey = process.env.ASAAS_API_KEY;
      if (!asaasKey) {
        return {
          purchaseId: 0,
          status: "pending" as const,
          paymentUrl: null,
          pixQrCode: null,
          pixCopyPaste: null,
          message: "Asaas não configurado. Configure ASAAS_API_KEY no .env para processar pagamentos.",
        };
      }

      const customer = await findOrCreateCustomer({
        name: ctx.user.name ?? "Cliente",
        email: ctx.user.email ?? "",
        cpfCnpj: input.cpfCnpj,
        phone: input.phone,
      });

      const billingType = input.paymentMethod === "pix" ? "PIX"
        : input.paymentMethod === "boleto" ? "BOLETO" : "CREDIT_CARD";

      const payment = await createPayment({
        customerId: customer.id,
        billingType,
        value: productRow.priceCents / 100,
        dueDate: dueDateStr(),
        description: `VPEX — ${productRow.name}`,
        externalReference: `user_${ctx.user.id}_product_${productRow.id}`,
      });

      if (db) {
        const [result] = await db.insert(purchases).values({
          userId: ctx.user.id,
          productId: productRow.id,
          asaasPaymentId: payment.id,
          asaasCustomerId: customer.id,
          status: "pending",
          amountCents: productRow.priceCents,
          paymentMethod: input.paymentMethod,
          paymentUrl: payment.invoiceUrl ?? payment.bankSlipUrl ?? null,
          pixQrCode: payment.pixQrCodeImage ?? null,
          pixCopyPaste: payment.pixCopiaECola ?? null,
        }).returning({ id: purchases.id });

        return {
          purchaseId: result.id,
          status: "pending" as const,
          paymentUrl: payment.invoiceUrl ?? payment.bankSlipUrl ?? null,
          pixQrCode: payment.pixQrCodeImage ?? null,
          pixCopyPaste: payment.pixCopiaECola ?? null,
          message: null,
        };
      }

      return {
        purchaseId: 0,
        status: "pending" as const,
        paymentUrl: payment.invoiceUrl ?? payment.bankSlipUrl ?? null,
        pixQrCode: payment.pixQrCodeImage ?? null,
        pixCopyPaste: payment.pixCopiaECola ?? null,
        message: null,
      };
    }),

  /* ─── Verifica status de um pagamento ─── */
  verificarPagamento: protectedProcedure
    .input(z.object({ purchaseId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { status: "pending" as const };

      const [row] = await db
        .select()
        .from(purchases)
        .where(and(eq(purchases.id, input.purchaseId), eq(purchases.userId, ctx.user.id)))
        .limit(1);

      if (!row) throw new Error("Compra não encontrada");
      if (row.status === "paid") return { status: "paid" as const };
      if (!row.asaasPaymentId) return { status: row.status };

      const payment = await getPayment(row.asaasPaymentId).catch(() => null);
      if (!payment) return { status: row.status };

      const newStatus = mapAsaasStatus(payment.status);
      if (newStatus !== row.status) {
        await db.update(purchases).set({
          status: newStatus,
          paidAt: newStatus === "paid" ? new Date() : undefined,
        }).where(eq(purchases.id, input.purchaseId));
      }

      return { status: newStatus };
    }),
});

/* ─── Mock products (sem banco) ─── */
import type { Product } from "../../drizzle/schema";

const mockProducts: Product[] = [
  { id: 1, name: "Como Vender no Mercado Livre do Zero", description: "Guia completo para criar, configurar e escalar uma operação no Mercado Livre, do cadastro ao Full.", type: "ebook", segment: "varejo", priceCents: 4700, thumbnailUrl: null, contentUrl: null, featured: true, isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: "Shopee: Do Cadastro às Primeiras Vendas", description: "Passo a passo para entrar na Shopee, otimizar seus anúncios e crescer rápido.", type: "ebook", segment: "varejo", priceCents: 3700, thumbnailUrl: null, contentUrl: null, featured: false, isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: "Mentoria de Marketplace — 4 Sessões", description: "4 sessões 1:1 com especialistas VPEX. Diagnóstico, estratégia e acompanhamento da sua operação.", type: "mentoria", segment: "todos", priceCents: 149700, thumbnailUrl: null, contentUrl: null, featured: true, isActive: true, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: "Mentoria Agro Digital — 2 Sessões", description: "Como digitalizar sua produção e vender direto ao consumidor final, sem intermediários.", type: "mentoria", segment: "agro", priceCents: 79700, thumbnailUrl: null, contentUrl: null, featured: false, isActive: true, sortOrder: 4, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, name: "Setup Completo Mercado Livre", description: "Criamos e configuramos toda sua operação no Mercado Livre. Catálogo, anúncios e logística.", type: "servico", segment: "varejo", priceCents: 299700, thumbnailUrl: null, contentUrl: null, featured: true, isActive: true, sortOrder: 5, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, name: "Gestão Mensal de Marketplace", description: "Nossa equipe gerencia sua loja no ML, Shopee ou TikTok. Relatório semanal incluso.", type: "servico", segment: "todos", priceCents: 199700, thumbnailUrl: null, contentUrl: null, featured: false, isActive: true, sortOrder: 6, createdAt: new Date(), updatedAt: new Date() },
  { id: 7, name: "Hub VPEX — Painel de Gestão Completo", description: "Acesso ao Hub VPEX com painel de KPIs, relatórios, academia e ferramentas proprietárias.", type: "ferramenta", segment: "todos", priceCents: 99700, thumbnailUrl: null, contentUrl: null, featured: true, isActive: true, sortOrder: 7, createdAt: new Date(), updatedAt: new Date() },
  { id: 8, name: "Kit Franquia Digital", description: "E-book + mentoria + setup de presença digital para sua franquia. Pacote completo.", type: "ferramenta", segment: "franquia", priceCents: 499700, thumbnailUrl: null, contentUrl: null, featured: false, isActive: true, sortOrder: 8, createdAt: new Date(), updatedAt: new Date() },
];
