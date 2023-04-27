const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { mkdirp } = require('mkdirp');

const { TEMP_DIR, PORT } = require('./constants');
const { fontRouter } = require('./routes/font');
const { wordBankRouter } = require('./routes/word-bank');
const { dictionaryRouter } = require('./routes/dictionary');

// 初始化文件系统
mkdirp.sync(TEMP_DIR);

const app = express();

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// 测试用的接口
app.get('/hello', (req, res) => {
    res.send('Hello');
});

// Echo 接口
app.post('/echo', (req, res) => {
    res.send(req.body);
});

app.use('/font', fontRouter);
app.use('/word-bank', wordBankRouter);
app.use('/dictionary', dictionaryRouter);

app.listen(PORT, () => {
    console.log(`Blog Express 启动，端口：${PORT}`);
});
