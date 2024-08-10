const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Helper function to analyze sentence
function analyzeSentence(sentence) {
    const words = sentence.split(' ');
    const longestWord = words.reduce((longest, word) => word.length > longest.length ? word : longest, '');
    const shortestWord = words.reduce((shortest, word) => word.length < shortest.length ? word : shortest, longestWord);
    const sum = words.reduce((total, word) => total + word.length, 0);
  
    return {
      longestWord: longestWord.length,
      shortestWord: shortestWord,
      sum: sum
    };
}

// Words Widget API
app.get('/api/word_game', (req, res) => {
    const sentence = req.query.sentence || '';
    const statistics = analyzeSentence(sentence);
    res.json(statistics);
});

// Total Phone Bill API
let callPrice = 2.75;
let smsPrice = 0.65;

app.post('/api/phonebill/total', (req, res) => {
    const { bill } = req.body;
    const items = bill.split(',');
    const total = items.reduce((sum, item) => {
        if (item === 'call') return sum + callPrice;
        if (item === 'sms') return sum + smsPrice;
        return sum;
    }, 0);

    res.json({ total: total.toFixed(2) });
});

app.get('/api/phonebill/prices', (req, res) => {
    res.json({
        call: callPrice,
        sms: smsPrice
    });
});

app.post('/api/phonebill/price', (req, res) => {
    const { type, price } = req.body;
    if (type === 'call') {
        callPrice = price;
    } else if (type === 'sms') {
        smsPrice = price;
    }

    res.json({
        status: 'success',
        message: `The ${type} price was set to ${price}`
    });
});

// Enough Airtime API
app.post('/api/enough', (req, res) => {
    const { usage, available } = req.body;
    const items = usage.split(',');
    const totalCost = items.reduce((sum, item) => {
        if (item === 'call') return sum + callPrice;
        if (item === 'sms') return sum + smsPrice;
        return sum;
    }, 0);

    res.json({ result: (available - totalCost).toFixed(2) });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
