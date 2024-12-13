const express = require('express');
const router = express.Router();

router.get('/test-endpoint', async (req, res) => {
    try {
        res.json({ message: 'Connection Successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/inventory-update', async (req, res) => {
    try {
        const item = req.body;
        const itemName = item.name;
        const itemSKU = item.sku;
        const quantity = item.quantityOnHand;

        console.log(itemName + ' has ' + quantity + ' on hand.');

        res.status(200).send('Request Received');

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;