/**
 * 我手上有一些哈利波特的英文文本，我想对其按章节划分，每章的开头是 'Chapter n: ...'，它是单独的一行。
 * 我想写一个处理脚本，步骤如下：
 *
 * 1. 从控制台读取文本文件地址，并读取文本；
 * 2. 裁剪文本的第一行，得到文本的标题 `title` ；
 * 3. 将剩余文本按章节划分，每章的开头是 'Chapter n: ...'，它是单独的一行；
 * 4. 在输入文件的同目录下创建一个文件夹，文件夹名为 `title`
 * 5. 在文件夹中创建一个文件 `meta.json`，内容为书名及章节列表
 * 6. 对于每章节，创建一个文件，文件名为 `[章节标题].txt`，内容为章节内容
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// 从控制台读取文本文件地址，并读取文本
rl.question('请输入文本文件地址：', (filePath) => {
    rl.close();
    // 文件名可能有空格，所以可能会用单引号或双引号包裹
    filePath = filePath.replace(/^['"]|['"]$/g, '');
    const text = fs.readFileSync(filePath, 'utf-8');
    // 裁剪文本的第一行，得到文本的标题 `title`
    const title = text.split('\n')[0];
    // 将剩余文本按章节划分，每章的开头是 'Chapter n: ...'，它是单独的一行
    const chapters = text
        .split('\n')
        .slice(1)
        .map((line) => line.trim())
        .filter((line) => line)
        .reduce((chapters, line) => {
            if (line.startsWith('Chapter')) {
                chapters.push({
                    // 将 `Chapter n: ...` 转为 `n.xxx`
                    title: line.replace(/^Chapter (\d+): (.*)$/, '$1.$2'),
                    content: [],
                });
            } else {
                chapters[chapters.length - 1].content.push(line);
            }
            return chapters;
        }, []);
    // 在输入文件的同目录下创建一个文件夹，文件夹名为 `title`
    const dirName = `${title}`;
    // 如果文件夹已存在，则删除
    if (fs.existsSync(path.join(path.dirname(filePath), dirName))) {
        fs.rmSync(path.join(path.dirname(filePath), dirName), {
            recursive: true,
        });
    }
    const dirPath = path.join(path.dirname(filePath), dirName);
    fs.mkdirSync(dirPath);
    // 在文件夹中创建一个文件 `meta.json`，内容为书名及章节列表
    const meta = {
        title,
        chapters: chapters.map((chapter) => chapter.title),
    };
    fs.writeFileSync(path.join(dirPath, 'meta.json'), JSON.stringify(meta));
    // 对于每章节，创建一个文件，文件名为 `[章节标题].txt`，内容为章节内容
    chapters.forEach((chapter) => {
        const chapterPath = path.join(dirPath, `${chapter.title}.txt`);
        fs.writeFileSync(chapterPath, chapter.content.join('\n'));
    });
});
