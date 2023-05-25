const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { mkdirp } = require('mkdirp');

const { Dir, PORT } = require('./constants');
const { fontRouter } = require('./routes/font');
const { wordBankRouter } = require('./routes/word-bank');
const { dictionaryRouter } = require('./routes/dictionary');
const { staticsRouter } = require('./routes/statics');

// 初始化文件系统
mkdirp.sync(Dir.temp);

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
app.use('/statics', staticsRouter);

app.use('*', (_, res) => {
    res.status(404).send('Not Found');
});

// error handle
app.use((err, _, res, __) => {
    res.status(500).send('Server Error');
});

app.listen(PORT, () => {
    console.log(`Express 启动（${process.env.NODE_ENV}），端口：${PORT}`);
});
