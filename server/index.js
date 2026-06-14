process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// 数据补丁
require('./scripts/index');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { PORT } = require('./config');
const { userRouter } = require('./routes/user');
const { wordBankRouter } = require('./routes/word-bank');
const { dictionaryRouter } = require('./routes/dictionary');
const { staticsRouter } = require('./routes/statics');
const { weaverRouter } = require('./routes/weaver');
const { shortcutRouter } = require('./routes/shortcut');
const { luoyeRouter } = require('./modules/luoye/router');
const { logRouter } = require('./modules/support/router');
const { playlistRouter } = require('./modules/playlist/router');

const app = express();
const LUOYE_CHAT_SESSION_BODY_LIMIT = '10mb';

app.use(cors());
app.use(cookieParser());
// AI 会话消息会包含完整 assistant 输出，单独放宽请求体上限。
app.use(
    '/luoye/chat-sessions',
    bodyParser.json({ limit: LUOYE_CHAT_SESSION_BODY_LIMIT }),
);
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
app.use('/word-bank', wordBankRouter);
app.use('/dictionary', dictionaryRouter);
app.use('/statics', staticsRouter);
app.use('/weaver', weaverRouter);
app.use('/shortcut', shortcutRouter);
app.use('/luoye', luoyeRouter);
app.use('/support', logRouter);
app.use('/playlist', playlistRouter);

app.use('*', (_, res) => {
    res.status(404).send({
        error: 'Not Found',
    });
});

// error handle
app.use((error, _, res, __) => {
    console.log(error);
    if (error?.type === 'entity.too.large') {
        return res.status(413).send({
            error: 'Payload Too Large',
            message: '请求体过大',
        });
    }
    res.status(500).send({
        error: res.error || 'Internal Server Error',
        message: res.message || '服务器错误',
    });
});

app.listen(PORT, () => {
    console.log(`Express 启动（${process.env.NODE_ENV}），端口：${PORT}`);
});
