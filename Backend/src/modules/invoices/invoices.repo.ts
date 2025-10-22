import { supa } from '../../infra/supabase';

export interface InvoiceRow {
  id: number;
  invoice_number: string;   // legible (ej. INV-2025-0001)
  contract_code: string;    // legible (ej. CT-0001)
  customer_name: string;
  total_amount_cents: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  created_at: string;
}

export async function findInvoiceByContractCode(contractCode: string) {
  const { data, error } = await supa
    .from('invoices')
    .select('*')
    .eq('contract_code', contractCode)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as InvoiceRow | null;
}

export async function findInvoiceById(id: number) {
  const { data, error } = await supa
    .from('invoices')
    .select('*')
    .eq('id', id)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as InvoiceRow | null;
}

export async function markInvoicePaid(id: number) {
  const { data, error } = await supa
    .from('invoices')
    .update({ status: 'PAID' })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as InvoiceRow;
}
