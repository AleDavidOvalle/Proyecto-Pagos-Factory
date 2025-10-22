import { IntegrationSuite } from './contracts';
import { MockSuite } from './suite/MockSuite';

export type SuiteKind = 'mock' | 'wompi' | 'payu';

export class IntegrationSuiteFactory {
  static create(_provider: SuiteKind): IntegrationSuite {
    return new MockSuite();
  }
}
