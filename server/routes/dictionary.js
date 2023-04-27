/**
 * 接入有道翻译 API ，转发数据
 * 要做调用限制，每日最多 1000 次，每小时最多 100 次
 *
 * 有一个注意点，也是一个实现，即签名的生成，官方的要求如下：
 * 1. signType=v3；
 * 2. sign=sha256(应用ID+input+salt+curtime+应用密钥)；
 * 3. 其中，input的计算方式为：input=q前10个字符 + q长度 + q后10个字符（当q长度大于20）或 input=q字符串（当q长度小于等于20）；
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const sha256 = require('sha256');

const YOUDAO_SECRET = {
    appKey: '67dc9e08c2357b3a',
    appSecret: '33zK8aOF6loVTl2WIbWUULGj5L41NYgW',
};

const YOUDAO_API = 'https://openapi.youdao.com/api';

// 生成签名
const generateSign = (q, salt, curtime) => {
    // 如果 q 的长度大于 20 ，则截取前 10 个字符和后 10 个字符
    if (q.length > 20) {
        q = q.substr(0, 10) + q.length + q.substr(-10);
    }
    return sha256(
        `${YOUDAO_SECRET.appKey}${q}${salt}${curtime}${YOUDAO_SECRET.appSecret}`,
    );
};

// 查单词接口，通过 query 参数传 word 单词
router.get('/', async (req, res) => {
    const { word } = req.query;
    const salt = Date.now();
    const curtime = Math.round(Date.now() / 1000);
    const sign = generateSign(word, salt, curtime);
    const { data } = await axios.get(YOUDAO_API, {
        params: {
            q: word,
            from: 'EN',
            to: 'zh-CHS',
            appKey: YOUDAO_SECRET.appKey,
            salt,
            sign,
            signType: 'v3',
            curtime,
        },
    });
    if (data.errorCode !== '0') {
        res.status(500).send(data);
        return;
    }
    res.send(data);
});

module.exports = { dictionaryRouter: router };
