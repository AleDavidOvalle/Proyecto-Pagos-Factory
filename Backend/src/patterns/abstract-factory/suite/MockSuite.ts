import { IntegrationSuite, PaymentGateway, WebhookVerifier, ReceiptBuilder } from '../contracts';

class MockGateway implements PaymentGateway {
  async pay(invoiceId: number, _amountCents: number) {
    return { status: 'SUCCESS' as const, ref: `MOCK-${invoiceId}-${Date.now()}` };
  }
  async refund(_providerRef: string, _amountCents: number) {
    return true;
  }
}

class MockVerifier implements WebhookVerifier {
  verifySignature(_headers: Record<string,string>, _rawBody: string) { return true; }
}

class MockReceipt implements ReceiptBuilder {
  async build(paymentId: number, _data: { amountCents: number; contractCode: string }) {
    return { number: `R-${String(paymentId).padStart(6,'0')}`, pdfUrl: undefined };
  }
}

export class MockSuite implements IntegrationSuite {
  gateway: PaymentGateway = new MockGateway();
  verifier: WebhookVerifier = new MockVerifier();
  receipt:  ReceiptBuilder = new MockReceipt();
}
