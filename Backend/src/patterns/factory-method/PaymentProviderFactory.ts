import { IPaymentProvider } from './IPaymentProvider';
import { MockPayProvider } from './providers/MockPayProvider';

export type ProviderKind = 'mock' | 'wompi' | 'payu';

export class PaymentProviderFactory {
  static create(_provider: ProviderKind): IPaymentProvider {
    // Por ahora solo Mock. (Listo para extender a wompi/payu)
    return new MockPayProvider();
  }
}
