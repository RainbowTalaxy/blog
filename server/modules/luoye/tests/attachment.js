const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { default: axios } = require('axios');
const { Dir, Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');

const ONE_PIXEL_PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
    'base64',
);

const uploadImage = async (rocket, buffer, filename, contentType) => {
    const form = new FormData();
    form.append('file', buffer, {
        filename,
        contentType,
    });
    const { data } = await axios.post(
        `${Server}/luoye/attachments/images`,
        form,
        {
            headers: {
                ...form.getHeaders(),
                Cookie: `token=${rocket.token}`,
            },
            maxBodyLength: Infinity,
            validateStatus: () => true,
        },
    );
    if (data.error) throw new Error(data.message || data.error);
    return data;
};

const uploadImageNeg = async (rocket, buffer, filename, contentType) => {
    const form = new FormData();
    form.append('file', buffer, {
        filename,
        contentType,
    });
    const { data } = await axios.post(
        `${Server}/luoye/attachments/images`,
        form,
        {
            headers: {
                ...form.getHeaders(),
                Cookie: `token=${rocket.token}`,
            },
            maxBodyLength: Infinity,
            validateStatus: () => true,
        },
    );
    if (data.error) return null;
    throw new Error('Expect "error"');
};

const uploadStaticNeg = async (rocket) => {
    const form = new FormData();
    form.append('file', ONE_PIXEL_PNG, {
        filename: 'luoye-static-forbidden.png',
        contentType: 'image/png',
    });
    form.append('path', 'temp/luoye');
    const { data } = await axios.post(`${Server}/statics/upload`, form, {
        headers: {
            ...form.getHeaders(),
            Cookie: `token=${rocket.token}`,
        },
        validateStatus: () => true,
    });
    if (data.error) return null;
    throw new Error('Expect "error"');
};

const uploadStatic = async (rocket, filename) => {
    const form = new FormData();
    form.append('file', ONE_PIXEL_PNG, {
        filename,
        contentType: 'image/png',
    });
    form.append('path', 'temp/luoye');
    const { data } = await axios.post(`${Server}/statics/upload`, form, {
        headers: {
            ...form.getHeaders(),
            Cookie: `token=${rocket.token}`,
        },
        validateStatus: () => true,
    });
    if (data.error) throw new Error(data.message || data.error);
    return data;
};

async function test() {
    const testCase = new TestCase('Luoye - Attachment', true);
    const talaxy = new Rocket(Server + '/luoye');
    const allay = new Rocket(Server + '/luoye');
    const visitor = new Rocket(Server + '/luoye');
    const uploadedFiles = [];

    await talaxy.login('talaxy', 'talaxy');
    await allay.login('allay', 'allay');

    try {
        await testCase.neg('image upload should require login', async () => {
            await uploadImage(visitor, ONE_PIXEL_PNG, 'visitor.png', 'image/png');
        });

        await testCase.pos('normal user should upload png image', async () => {
            const result = await uploadImage(
                allay,
                ONE_PIXEL_PNG,
                'normal-user.png',
                'image/png',
            );
            uploadedFiles.push(result.file.path);
            Assert.expect(result.message, '图片上传成功');
            Assert.expect(result.file.mimetype, 'image/png');
            Assert.expect(result.file.path.startsWith('temp/luoye/'), true);
            Assert.expect(result.file.url.includes('undefined'), false);
        });

        await testCase.pos('non-image upload should fail', async () => {
            await uploadImageNeg(
                allay,
                Buffer.from('not image'),
                'note.txt',
                'text/plain',
            );
        });

        await testCase.pos('oversized image upload should fail', async () => {
            await uploadImageNeg(
                allay,
                Buffer.alloc(10 * 1024 * 1024 + 1),
                'large.png',
                'image/png',
            );
        });

        await testCase.pos('normal user should not use static upload', async () => {
            await uploadStaticNeg(allay);
        });

        await testCase.pos('admin static upload should stay available', async () => {
            const result = await uploadStatic(
                talaxy,
                `admin-static-${Date.now()}.png`,
            );
            uploadedFiles.push(result.file.path);
            Assert.expect(result.file.path.startsWith('temp/luoye/'), true);
        });
    } finally {
        uploadedFiles.forEach((filePath) => {
            const fullPath = path.join(Dir.static, filePath);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        });
    }

    return testCase.stat();
}

module.exports = test;
