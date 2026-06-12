const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const sharp = require('sharp');
const { default: axios } = require('axios');
const { Dir, Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const { LuoyeFile } = require('../utility');

const ONE_PIXEL_PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
    'base64',
);

const createJpeg = () =>
    sharp({
        create: {
            width: 3200,
            height: 1800,
            channels: 3,
            background: { r: 120, g: 80, b: 40 },
        },
    })
        .jpeg({ quality: 100 })
        .toBuffer();

const createPng = () =>
    sharp({
        create: {
            width: 16,
            height: 16,
            channels: 4,
            background: { r: 120, g: 80, b: 40, alpha: 1 },
        },
    })
        .png()
        .toBuffer();

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
                await createPng(),
                'normal-user.png',
                'image/png',
            );
            uploadedFiles.push(result.file.path);
            Assert.expect(result.message, '图片上传成功');
            Assert.expect(result.file.mimetype, 'image/png');
            Assert.expect(result.file.path.startsWith('temp/luoye/'), true);
            Assert.expect(result.file.url.includes('undefined'), false);
            const uploadedFile = path.join(Dir.static, result.file.path);
            Assert.expect(fs.existsSync(uploadedFile), true);
            Assert.expect(result.file.size, fs.statSync(uploadedFile).size);
        });

        await testCase.pos('jpeg upload should be processed by sharp', async () => {
            const result = await uploadImage(
                allay,
                await createJpeg(),
                'compressible.jpg',
                'image/jpeg',
            );
            uploadedFiles.push(result.file.path);
            const uploadedFile = path.join(Dir.static, result.file.path);
            Assert.expect(fs.existsSync(uploadedFile), true);
            Assert.expect(result.file.mimetype, 'image/jpeg');
            Assert.expect(result.file.path.startsWith('temp/luoye/'), true);
            Assert.expect(result.file.size, fs.statSync(uploadedFile).size);
        });

        await testCase.pos('non-image upload should fail', async () => {
            await uploadImageNeg(
                allay,
                Buffer.from('not image'),
                'note.txt',
                'text/plain',
            );
        });

        await testCase.pos('fake image content should fail', async () => {
            await uploadImageNeg(
                allay,
                Buffer.from('not image'),
                'fake.png',
                'image/png',
            );
        });

        await testCase.pos('mismatched image mime should fail', async () => {
            await uploadImageNeg(
                allay,
                await createPng(),
                'mismatch.jpg',
                'image/jpeg',
            );
        });

        await testCase.pos('oversized image upload should fail', async () => {
            await uploadImageNeg(
                allay,
                Buffer.alloc(LuoyeFile.MAX_IMAGE_UPLOAD_SIZE + 1),
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
