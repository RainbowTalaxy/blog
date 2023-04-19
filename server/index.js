const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

const fontRouter = require('./routes/font');
const wordBankRouter = require('./routes/word-bank');

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/hello', (req, res) => {
    res.send('Hello, World');
});

app.use('/font', fontRouter);
app.use('/word-bank', wordBankRouter);

app.listen(port, () => {
    console.log(`Blog Express 启动，端口：${port}`);
});
