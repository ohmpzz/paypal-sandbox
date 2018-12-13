import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import paypal from 'paypal-rest-sdk';
import path from 'path';

import { validate as ValidateBeer } from './validate-beer';

const app = express();

paypal.configure({
  mode: process.env.PAYPAL_MODE, //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

let total = 0;

app.post('/payment/paypal', (req, res) => {
  const { error, value } = ValidateBeer(req);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { quantity } = value;
  const price = 1000;
  total = price * quantity;

  const create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: `${process.env.REDIRECT_URL}/success`,
      cancel_url: `${process.env.REDIRECT_URL}/cancel`,
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: 'Beer IPA',
              sku: '001',
              price,
              currency: 'THB',
              quantity,
            },
          ],
        },
        amount: {
          currency: 'THB',
          total,
        },
        description: 'The best beer in Thailand',
      },
    ],
  };

  return paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      return res
        .status(error.httpStatusCode)
        .json({ messages: error.message, payment: create_payment_json });
    } else {
      const approval_url = payment.links.find(p => p.rel == 'approval_url');
      res.json({ approval_url });
    }
  });
});

app.get('/success', (req, res) => {
  const paymentId = req.query.paymentId;
  const payer_id = req.query.PayerID;
  const execute_payment_json = {
    payer_id,
    transactions: [
      {
        amount: {
          currency: 'THB',
          total,
        },
      },
    ],
  };
  total = 0;

  return paypal.payment.execute(
    paymentId,
    execute_payment_json,
    (error, payment) => {
      if (error) {
        throw error;
      } else {
        const { create_time } = payment;
        const { amount, related_resources } = payment.transactions[0];
        const { id } = related_resources[0].sale;
        return res.redirect(
          `${
            process.env.REDIRECT_URL
          }/?id=${id}&create_time=${create_time}&total=${amount.total}`
        );
      }
    }
  );
});

app.get('/cancel', (req, res) => {
  res.send('cancel');
});

app.use(express.static(path.join(__dirname, '../public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default app;
