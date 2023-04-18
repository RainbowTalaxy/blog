const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

const fontRouter = require('./routes/font');

app.use(cors());

app.use('/font', fontRouter);

app.listen(port, () => {
    console.log(`Blog Express 启动，端口：${port}`);
});
