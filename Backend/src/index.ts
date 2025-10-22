import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import paymentsRouter from './modules/payments/payments.controller';
import { supa } from './infra/supabase';

const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(cors({ origin: ['http://localhost:4200', 'http://127.0.0.1:4200'] }));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => res.json({ ok: true, service: 'payments-factory' }));

app.get('/test-db', async (_req, res) => {
  try {
    const { data, error } = await supa
      .from('invoices')
      .select('id,invoice_number,contract_code,total_amount_cents,status')
      .limit(1);
    if (error) throw error;
    res.json({ ok: true, sample: data });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use('/api', paymentsRouter);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
