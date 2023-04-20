const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { mkdirp } = require('mkdirp');

const { TEMP_DIR } = require('./constants');
const fontRouter = require('./routes/font');
const wordBankRouter = require('./routes/word-bank');

// 初始化文件系统
mkdirp.sync(TEMP_DIR);

const app = express();
const port = 4000;

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// 测试用的接口
app.get('/hello', (req, res) => {
    res.send('Hello');
});

app.use('/font', fontRouter);
app.use('/word-bank', wordBankRouter);

app.listen(port, () => {
    console.log(`Blog Express 启动，端口：${port}`);
});
