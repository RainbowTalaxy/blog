const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { PORT } = require('./config');
const { userRouter } = require('./routes/user');
const { fontRouter } = require('./routes/font');
const { wordBankRouter } = require('./routes/word-bank');
const { dictionaryRouter } = require('./routes/dictionary');
const { staticsRouter } = require('./routes/statics');
const { weaverRouter } = require('./routes/weaver');
const { luoyeRouter } = require('./routes/luoye');

const app = express();

app.use(cors());
app.use(cookieParser());
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

app.use('/user', userRouter);
app.use('/font', fontRouter);
app.use('/word-bank', wordBankRouter);
app.use('/dictionary', dictionaryRouter);
app.use('/statics', staticsRouter);
app.use('/weaver', weaverRouter);
app.use('/luoye', luoyeRouter);

app.use('*', (_, res) => {
    res.status(404).send({
        error: 'Not Found',
    });
});

// error handle
app.use((error, _, res, __) => {
    console.log(error);
    res.status(500).send({
        error: 'Internal Server Error',
    });
});

app.listen(PORT, () => {
    console.log(`Express 启动（${process.env.NODE_ENV}），端口：${PORT}`);
});
