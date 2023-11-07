const express = require('express');
const router = express.Router();

const temporaryTokenOfAllay =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFsbGF5IiwicGFzc3dvcmQiOiJhbGxheTEyMyIsImlhdCI6MTY5OTM1MDEyNiwiZXhwIjoxNjk5OTU0OTI2fQ.Tkfqg1icJpXiREi-SVFd5xhlAa2hi3EiFH7r0ApCLwI';

router.get('/weaver', (_, res) => {
    res.redirect(`/weaver?token=${temporaryTokenOfAllay}`);
});

router.get('/luoye', (_, res) => {
    res.redirect(`/luoye?token=${temporaryTokenOfAllay}`);
});

module.exports = { demoRouter: router };
