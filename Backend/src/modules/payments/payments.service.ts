import { supa } from '../../infra/supabase';
import { PaymentProviderFactory } from '../../patterns/factory-method/PaymentProviderFactory';
import { IntegrationSuiteFactory } from '../../patterns/abstract-factory/IntegrationSuiteFactory';
import { findInvoiceById, markInvoicePaid } from '../invoices/invoices.repo';

type Provider = 'mock' | 'wompi' | 'payu';

export async function checkout(invoiceId: number, provider: Provider) {
  const invoice = await findInvoiceById(invoiceId);
  if (!invoice) throw new Error('Invoice not found');
  if (invoice.status === 'PAID') throw new Error('Invoice already paid');

  const amountCents = invoice.total_amount_cents;
  const contractCode  = invoice.contract_code;

  // Factory Method → proveedor individual
  const p = PaymentProviderFactory.create(provider);
  const pRes = await p.pay(invoiceId, amountCents);
  if (!pRes.ok) throw new Error('Payment failed');

  // Abstract Factory → familia coherente
  const suite = IntegrationSuiteFactory.create(provider);
  const gwRes = await suite.gateway.pay(invoiceId, amountCents);
  if (gwRes.status !== 'SUCCESS') throw new Error('Gateway failed');

  // Insert payment
  const { data: payment, error: payErr } = await supa
    .from('payments')
    .insert({
      invoice_id: invoiceId,
      provider,
      status: 'SUCCESS',
      gateway_reference: gwRes.ref
    })
    .select()
    .single();
  if (payErr) throw payErr;

  // Build receipt
  const receiptData = await suite.receipt.build(payment.id as number, { amountCents, contractCode });

  const { data: receipt, error: recErr } = await supa
    .from('receipts')
    .insert({
      payment_id: payment.id,
      receipt_number: receiptData.number,
      pdf_url: receiptData.pdfUrl ?? null
    })
    .select()
    .single();
  if (recErr) throw recErr;

  await markInvoicePaid(invoiceId);

  return { ok: true, providerRef: gwRes.ref, receipt };
}
