import { supa } from '../../infra/supabase';

export type Invoice = {
  id: number;
  invoice_number: string;
  contract_code: string;
  customer_name: string;
  total_amount_cents: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  created_at: string;
};

export async function findInvoiceById(id: number): Promise<Invoice | null> {
  const { data, error } = await supa
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Invoice;
}

export async function findInvoiceByContract(code: string): Promise<Invoice | null> {
  const { data, error } = await supa
    .from('invoices')
    .select('*')
    .eq('contract_code', code)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as Invoice;
}

export async function markInvoicePaid(id: number) {
  const { error } = await supa
    .from('invoices')
    .update({ status: 'PAID' })
    .eq('id', id);
  if (error) throw error;
}

export async function createInvoice(input: {
  contractCode: string;
  customerName: string;
  amountCents: number;
}): Promise<Invoice> {
  // número legible para demo
  const y = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
  const invoice_number = `INV-${y}-${seq}`;

  const { data, error } = await supa
    .from('invoices')
    .insert({
      invoice_number,
      contract_code: input.contractCode,
      customer_name: input.customerName,
      total_amount_cents: input.amountCents,
      status: 'PENDING'
    })
    .select()
    .single();

  if (error) throw error;
  return data as Invoice;
}
