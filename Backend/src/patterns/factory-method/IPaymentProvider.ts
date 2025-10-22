export interface IPaymentProvider {
  pay(invoiceId: number, amountCents: number): Promise<{ ok: boolean; ref?: string }>;
  refund(ref: string, amountCents: number): Promise<boolean>;
}
