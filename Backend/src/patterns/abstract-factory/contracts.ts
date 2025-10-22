export interface PaymentGateway {
  pay(invoiceId: number, amountCents: number): Promise<{ status: 'SUCCESS'|'FAILED'; ref?: string }>;
  refund(providerRef: string, amountCents: number): Promise<boolean>;
}
export interface WebhookVerifier {
  verifySignature(headers: Record<string,string>, rawBody: string): boolean;
}
export interface ReceiptBuilder {
  build(paymentId: number, data: { amountCents: number; contractCode: string }): Promise<{ number: string; pdfUrl?: string }>;
}
export interface IntegrationSuite {
  gateway: PaymentGateway;
  verifier: WebhookVerifier;
  receipt: ReceiptBuilder;
}
