const fs = require('fs');

const outputDir = '/Users/talaxy/Downloads';
const bookName = 'The-Midnight-Library';

// 读取文件
let text = fs.readFileSync(`${outputDir}/${bookName}.txt`, 'utf-8');

// 去除文本中多余的空行，使只最多有一个空行
text = text.replace(/\n{2,}/g, '\n\n');

// 去除每行文本前后的空格
text = text
    .split('\n')
    .map((line) => line.trim())
    .join('\n');

// 截断第一行和剩余部分，分别作为书名和书本内容
const [bookTitle, ...bookContent] = text.split('\n\n');
console.log(bookTitle);

// 将章节内容按章节标题划分，章节标题形如 `CHAPTER ONE: ...`，请提取出章节标题 title 及章节内容 content
const chapters = [];
bookContent.forEach((line) => {
    if (line.startsWith('CHAPTER')) {
        console.log(line);
        chapters.push({
            title: line.replace(/CHAPTER: (.*)/, '$1'),
            content: [],
        });
    } else {
        chapters[chapters.length - 1].content.push(line);
    }
});

// 在下载文件夹中创建一个文件夹，文件夹名为 `bookTitle`，如果文件夹已存在，则删除
if (fs.existsSync(`${outputDir}/${bookTitle}`)) {
    fs.rmSync(`${outputDir}/${bookTitle}`, {
        recursive: true,
    });
}
fs.mkdirSync(`${outputDir}/${bookTitle}`);

// 在文件夹中创建一个文件 `meta.json`，内容为书名及章节列表
const meta = {
    title: bookTitle,
    chapters: chapters.map((chapter) => chapter.title),
};
fs.writeFileSync(`${outputDir}/${bookTitle}/meta.json`, JSON.stringify(meta));

// 对于每章节，创建一个文件，文件名为 `[章节标题].txt`，内容为章节内容
chapters.forEach((chapter) => {
    const chapterPath = `${outputDir}/${bookTitle}/${chapter.title}.txt`;
    fs.writeFileSync(chapterPath, chapter.content.join('\n'));
});

// 回写
fs.writeFileSync(`${outputDir}/${bookName}-output.txt`, text, 'utf-8');
