const express = require('express');
const router = express.Router();
const Fontmin = require('fontmin');
const { downloadFile } = require('../utils');

router.get('/compress', async (req, res) => {
    try {
        const fontName = decodeURI(req.query.fontName) ?? 'font';
        const fontUrl = decodeURI(req.query.fontUrl);
        const charSet = decodeURI(req.query.charSet);
        const tempDir = 'temp/fonts';
        const dest = `${tempDir}/${fontName}.ttf`;

        if (!fontUrl || !charSet) {
            res.status(400).send({
                error: 'fontUrl and charSet are required',
            });
            return;
        }

        await downloadFile(fontUrl, dest);

        // 创建一个 Fontmin 实例
        const fm = new Fontmin()
            .src(dest)
            .use(
                Fontmin.glyph({
                    text: charSet,
                    hinting: false, // keep ttf hint info (fpgm, prep, cvt). default = true
                }),
            )
            .dest(tempDir);

        fm.run((err, files) => {
            if (err) {
                console.log(err);
                res.status(500).send({
                    error: 'font generation failed',
                });
            } else {
                console.log('font generation success');
                res.sendFile(files[0].path);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'An error occurred while generating the font.',
        });
    }
});

module.exports = { fontRouter: router };
