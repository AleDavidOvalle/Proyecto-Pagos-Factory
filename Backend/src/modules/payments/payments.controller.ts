import { Router } from 'express';
import { supa } from '../../infra/supabase';
import { checkout } from './payments.service';
import {
  findInvoiceByContract,
  createInvoice
} from '../invoices/invoices.repo';

const router = Router();

/**
 * GET /api/invoices/by-contract/:code  → obtener factura por contrato
 */
router.get('/invoices/by-contract/:code', async (req, res) => {
  try {
    const code = String(req.params.code);
    const inv = await findInvoiceByContract(code);
    if (!inv) return res.status(404).json({ ok: false, error: 'Invoice not found' });
    res.json(inv);
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * POST /api/invoices  → crear factura
 * body: { contractCode, customerName, amountCents }
 */
router.post('/invoices', async (req, res) => {
  try {
    const { contractCode, customerName, amountCents } = req.body || {};
    if (!contractCode || !customerName || !amountCents) {
      return res.status(400).json({
        ok: false,
        error: 'Campos requeridos: contractCode, customerName, amountCents'
      });
    }
    const inv = await createInvoice({
      contractCode,
      customerName,
      amountCents: Number(amountCents),
    });
    res.status(201).json({ ok: true, invoice: inv });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * POST /api/payments/checkout  → procesar pago (Factory + Abstract Factory)
 * body: { invoiceId, provider: 'mock' | 'wompi' | 'payu' }
 */
router.post('/payments/checkout', async (req, res) => {
  try {
    const { invoiceId, provider } = req.body || {};
    if (!invoiceId || !provider) {
      return res.status(400).json({ ok: false, error: 'invoiceId y provider son requeridos' });
    }
    const result = await checkout(Number(invoiceId), provider);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

/**
 * GET /api/payments/by-invoice/:id  → historial de pagos + recibos de una factura
 */
router.get('/payments/by-invoice/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ ok: false, error: 'invoice id inválido' });

    const { data, error } = await supa
      .from('payments')
      .select(`
        id, provider, status, gateway_reference, created_at,
        receipts:receipts ( id, receipt_number, pdf_url, created_at )
      `)
      .eq('invoice_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ ok: true, items: data ?? [] });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
