import { IPaymentProvider } from '../IPaymentProvider';

export class MockPayProvider implements IPaymentProvider {
  async pay(invoiceId: number, _amountCents: number) {
    return { ok: true, ref: `MOCK-${invoiceId}-${Date.now()}` };
  }
  async refund(_ref: string, _amountCents: number) {
    return true;
  }
}
