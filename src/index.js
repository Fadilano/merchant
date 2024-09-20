const express = require('express');
const axios = require('axios');
const app = express();

const SERVER_KEY = 'SB-Mid-server-Zbsb-T_jALFkRUFnHZadfbd2';
const IS_PRODUCTION = false;
const API_URL = IS_PRODUCTION 
  ? 'https://app.midtrans.com/snap/v1/transactions' 
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

app.use(express.json());

app.post('/charge', async (req, res) => {
  try {
    const chargeResult = await chargeAPI(req.body);
    res.status(chargeResult.status).json(chargeResult.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to charge' });
  }
});

async function chargeAPI(requestBody) {
  const response = await axios.post(API_URL, requestBody, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${Buffer.from(SERVER_KEY + ':').toString('base64')}`,
    },
  });
  return {
    status: response.status,
    data: response.data,
  };
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
