import { Router } from 'express';
import { checkout } from './payments.service';
import { findInvoiceByContractCode } from '../invoices/invoices.repo';

const router = Router();

// GET /api/invoices/by-contract/:code
router.get('/invoices/by-contract/:code', async (req, res) => {
  try {
    const inv = await findInvoiceByContractCode(req.params.code);
    if (!inv) return res.status(404).json({ error: 'No invoice for that contract' });
    res.json(inv);
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/payments/checkout
router.post('/payments/checkout', async (req, res) => {
  try {
    const { invoiceId, provider = 'mock' } = req.body || {};
    if (invoiceId == null) return res.status(400).json({ error: 'invoiceId required' });
    const result = await checkout(Number(invoiceId), provider);
    res.json(result);
  } catch (e:any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
