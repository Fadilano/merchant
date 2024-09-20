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
    // Prepare the request body for Midtrans
    const requestBody = {
      transaction_details: {
        order_id: req.body.order_id,  // Ensure this comes from the client
        gross_amount: req.body.gross_amount, // Ensure this comes from the client
      },
      customer_details: {
        first_name: req.body.name,       // Customer name
        email: req.body.email || 'customer@example.com', // Set default email if not provided
        phone: req.body.phone,            // Customer phone
        shipping_address: {
          address: req.body.address,      // Customer address
        },
      },
      item_details: req.body.cartItems.map(item => ({
        id: item.productId,               // Product ID
        price: item.price,                 // Product price
        quantity: item.quantity,           // Product quantity
        name: item.productName,           // Product name
      })),
      credit_card: {
        secure: true,
      },
    };

    const chargeResult = await chargeAPI(requestBody);
    res.status(chargeResult.status).json(chargeResult.data);
  } catch (error) {
    console.error('Error charging:', error);
    res.status(500).json({ error: 'Failed to charge', details: error.message });
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
