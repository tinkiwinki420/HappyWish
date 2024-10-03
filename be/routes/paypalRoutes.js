const express = require("express");
const router = express.Router();
const paypalClient = require("../config/paypalClient");

// Route to create a PayPal order
router.post("/create-paypal-order", async (req, res) => {
  const { totalPrice } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: totalPrice.toFixed(2),
        },
      },
    ],
  });

  try {
    const order = await paypalClient.client().execute(request);
    res.status(201).json({ id: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create PayPal order", error: err });
  }
});

module.exports = router;
