const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const { ChatSession, normalizeChatSession } = require('../chat-session');

async function test() {
    const testCase = new TestCase('Luoye - Chat Session', true);

    const talaxy = new Rocket(Server + '/luoye');
    const allay = new Rocket(Server + '/luoye');
    const visitor = new Rocket(Server + '/luoye');
    await talaxy.login('talaxy', 'talaxy');
    await allay.login('allay', 'allay');

    ChatSession.clear();

    await testCase.pos('create session without doc', async () => {
        const session = await talaxy.post('/chat-sessions', {});
        Assert.expect(session.schemaVersion, ChatSession.CURRENT_SCHEMA_VERSION);
        Assert.expect(session.userId, 'talaxy');
        Assert.expect(session.title, '新会话');
        Assert.array(session.messages, 0);
    });

    await testCase.neg('chat session list should require login', async () => {
        await visitor.get('/chat-sessions');
    });

    const workspace = await talaxy.post('/workspace', {
        name: 'chat-session',
    });
    const doc = await talaxy.post('/doc', {
        workspaceId: workspace.id,
        name: 'chat-doc',
    });

    let session;

    await testCase.pos('create session with readable doc', async () => {
        session = await talaxy.post('/chat-sessions', {
            docId: doc.id,
            docUpdatedAt: doc.updatedAt,
        });
        Assert.expect(session.docId, doc.id);
        Assert.expect(session.docUpdatedAt, doc.updatedAt);
    });

    await testCase.neg('create session with forbidden doc', async () => {
        await allay.post('/chat-sessions', {
            docId: doc.id,
        });
    });

    await testCase.pos('append user message', async () => {
        const attachment = {
            id: 'image-1',
            url: 'https://blog.talaxy.cn/statics/temp/luoye/cat.png',
            name: 'cat.png',
            mimeType: 'image/png',
            size: 123,
        };
        const updated = await talaxy.post(
            `/chat-sessions/${session.sessionId}/messages`,
            {
                message: {
                    type: 'user_message',
                    content: '帮我总结这篇文档',
                    attachments: [attachment],
                    createdAt: Date.now(),
                },
            },
        );
        Assert.array(updated.messages, 1);
        Assert.expect(updated.messages[0].type, 'user_message');
        Assert.expect(updated.messages[0].attachments[0].url, attachment.url);
        Assert.expect(updated.title, '帮我总结这篇文档');
        session = updated;
    });

    await testCase.pos('append image only user message', async () => {
        const imageOnlySession = await talaxy.post('/chat-sessions', {});
        const attachment = {
            id: 'image-only',
            url: 'https://blog.talaxy.cn/statics/temp/luoye/dog.png',
            name: 'dog.png',
            mimeType: 'image/png',
            size: 456,
        };
        const updated = await talaxy.post(
            `/chat-sessions/${imageOnlySession.sessionId}/messages`,
            {
                message: {
                    type: 'user_message',
                    content: '',
                    attachments: [attachment],
                    createdAt: Date.now(),
                },
            },
        );
        Assert.expect(updated.messages[0].attachments[0].name, 'dog.png');
        Assert.expect(updated.title, '图片：dog.png');
    });

    await testCase.pos('append user message should keep at most 3 images', async () => {
        const imageSession = await talaxy.post('/chat-sessions', {});
        const attachments = [0, 1, 2, 3].map((index) => ({
            id: `image-${index}`,
            url: `https://blog.talaxy.cn/statics/temp/luoye/${index}.png`,
            name: `${index}.png`,
            mimeType: 'image/png',
            size: 100 + index,
        }));
        const updated = await talaxy.post(
            `/chat-sessions/${imageSession.sessionId}/messages`,
            {
                message: {
                    type: 'user_message',
                    content: '看看这些图',
                    attachments,
                    createdAt: Date.now(),
                },
            },
        );
        Assert.array(updated.messages[0].attachments, 3);
    });

    await testCase.pos('append empty user message with invalid images should fail', async () => {
        const invalidSession = await talaxy.post('/chat-sessions', {});
        const invalidAttachments = [
            {
                id: 'bad-host',
                url: 'https://example.com/statics/temp/luoye/bad.png',
                name: 'bad-host.png',
                mimeType: 'image/png',
                size: 123,
            },
            {
                id: 'bad-path',
                url: 'https://blog.talaxy.cn/statics/other/bad.png',
                name: 'bad-path.png',
                mimeType: 'image/png',
                size: 123,
            },
            {
                id: 'bad-mime',
                url: 'https://blog.talaxy.cn/statics/temp/luoye/bad.txt',
                name: 'bad-mime.txt',
                mimeType: 'text/plain',
                size: 123,
            },
            {
                id: 'bad-size',
                url: 'https://blog.talaxy.cn/statics/temp/luoye/bad.png',
                name: 'bad-size.png',
                mimeType: 'image/png',
                size: 50 * 1024 * 1024 + 1,
            },
        ];

        for (const attachment of invalidAttachments) {
            await talaxy.negPost(
                `/chat-sessions/${invalidSession.sessionId}/messages`,
                {
                    message: {
                        type: 'user_message',
                        content: '',
                        attachments: [attachment],
                        createdAt: Date.now(),
                    },
                },
            );
        }

        const detail = await talaxy.get(
            `/chat-sessions/${invalidSession.sessionId}`,
        );
        Assert.array(detail.messages, 0);
    });

    await testCase.pos('append assistant message with text and tool parts', async () => {
        const updated = await talaxy.post(
            `/chat-sessions/${session.sessionId}/messages`,
            {
                message: {
                    type: 'assistant_message',
                    parts: [
                        {
                            type: 'text',
                            content: '可以，我先看看文档。',
                            createdAt: Date.now(),
                        },
                        {
                            type: 'tool_call',
                            toolName: 'save_doc_request',
                            runId: 'run-save-doc',
                            input: {
                                title: '总结',
                                content: '内容',
                            },
                            output: {
                                status: 'pending',
                            },
                            status: 'pending',
                            createdAt: Date.now(),
                        },
                    ],
                    createdAt: Date.now(),
                },
            },
        );
        Assert.array(updated.messages, 2);
        Assert.expect(updated.messages[1].type, 'assistant_message');
        Assert.expect(updated.messages[1].parts[0].type, 'text');
        Assert.expect(updated.messages[1].parts[1].type, 'tool_call');
        session = updated;
    });

    await testCase.pos('append large assistant message within body limit', async () => {
        const largeSession = await talaxy.post('/chat-sessions', {});
        const content = 'large assistant output\n'.repeat(7000);
        const updated = await talaxy.post(
            `/chat-sessions/${largeSession.sessionId}/messages`,
            {
                message: {
                    type: 'assistant_message',
                    parts: [
                        {
                            type: 'text',
                            content,
                            createdAt: Date.now(),
                        },
                    ],
                    createdAt: Date.now(),
                },
            },
        );
        Assert.expect(updated.messages[0].type, 'assistant_message');
        Assert.expect(
            updated.messages[0].parts[0].content.length,
            content.length,
        );
    });

    await testCase.pos('patch save doc request status', async () => {
        const updated = await talaxy.patch(
            `/chat-sessions/${session.sessionId}/tool-calls/run-save-doc`,
            {
                status: 'confirmed',
                content: 'confirmed',
            },
        );
        const part = updated.messages[1].parts[1];
        Assert.expect(part.status, 'confirmed');
        Assert.expect(part.content, 'confirmed');
        session = updated;
    });

    await testCase.pos('get session detail', async () => {
        const detail = await talaxy.get(
            `/chat-sessions/${session.sessionId}`,
        );
        Assert.expect(detail.sessionId, session.sessionId);
        Assert.array(detail.messages, 2);
    });

    await testCase.pos('list sessions and filter by docId', async () => {
        const sessions = await talaxy.get('/chat-sessions');
        if (!sessions.find((item) => item.sessionId === session.sessionId)) {
            Assert.throw('created session not found');
        }
        const filtered = await talaxy.get('/chat-sessions', {
            docId: doc.id,
        });
        if (filtered.find((item) => item.docId !== doc.id)) {
            Assert.throw('docId filter failed');
        }
    });

    await testCase.neg('other user should not read session', async () => {
        await allay.get(`/chat-sessions/${session.sessionId}`);
    });

    await testCase.pos('update session title', async () => {
        const updated = await talaxy.patch(
            `/chat-sessions/${session.sessionId}`,
            {
                title: '新的标题',
            },
        );
        Assert.expect(updated.title, '新的标题');
    });

    await testCase.pos('normalize old chat file shape', async () => {
        const old = normalizeChatSession({
            sessionId: 'old-session',
            userId: 'talaxy',
            messages: [
                {
                    messageId: 'user-1',
                    role: 'user',
                    content: '旧问题',
                    createdAt: 1,
                },
                {
                    messageId: 'assistant-1',
                    role: 'assistant',
                    content: [
                        {
                            messageId: 'text-1',
                            role: 'assistant',
                            content: '旧回答',
                            createdAt: 2,
                        },
                        {
                            role: 'tool',
                            runId: 'old-run',
                            name: 'save_doc_request',
                            content: 'cancelled',
                            createdAt: 3,
                        },
                    ],
                    createdAt: 2,
                },
            ],
            createdAt: 1,
            updatedAt: 3,
        });
        Assert.expect(old.schemaVersion, ChatSession.CURRENT_SCHEMA_VERSION);
        Assert.expect(old.messages[0].type, 'user_message');
        Assert.expect(old.messages[1].type, 'assistant_message');
        Assert.expect(old.messages[1].parts[1].type, 'tool_call');
        Assert.expect(old.messages[1].parts[1].status, 'cancelled');
    });

    await testCase.pos('normalize image only session title', async () => {
        const session = normalizeChatSession({
            sessionId: 'image-title-session',
            userId: 'talaxy',
            messages: [
                {
                    messageId: 'user-image',
                    type: 'user_message',
                    content: '',
                    attachments: [
                        {
                            id: 'image-title',
                            url: 'https://blog.talaxy.cn/statics/temp/luoye/title.png',
                            name: 'title.png',
                            mimeType: 'image/png',
                            size: 123,
                        },
                    ],
                    createdAt: 1,
                },
            ],
            createdAt: 1,
            updatedAt: 1,
        });
        Assert.expect(session.title, '图片：title.png');
    });

    await testCase.pos('stress list sessions with cleanup and limit', async () => {
        ChatSession.clear();

        const startAt = Date.now();

        for (let i = 0; i < ChatSession.MAX_SESSIONS + 30; i++) {
            const created = ChatSession.create('talaxy', {
                ...(i % 2 === 0 ? { docId: doc.id } : {}),
            });
            ChatSession.appendMessage(
                'talaxy',
                created.sessionId,
                {
                    type: 'user_message',
                    content: `压力测试消息 ${i}`,
                    createdAt: Date.now(),
                },
            );
        }

        const allSessions = await talaxy.get('/chat-sessions', { limit: 100 });
        Assert.array(allSessions, ChatSession.MAX_SESSIONS);

        const limitedSessions = await talaxy.get('/chat-sessions', {
            limit: 7,
        });
        Assert.array(limitedSessions, 7);

        const docSessions = await talaxy.get('/chat-sessions', {
            docId: doc.id,
            limit: 100,
        });
        if (docSessions.length === 0) {
            Assert.throw('doc sessions should not be empty');
        }
        if (docSessions.find((item) => item.docId !== doc.id)) {
            Assert.throw('stress docId filter failed');
        }

        const endAt = Date.now();
        console.log(
            '⏱️',
            '[Luoye - Chat Session]',
            'stress list sessions with cleanup and limit',
            `${endAt - startAt}ms`,
        );
    });

    session = await talaxy.post('/chat-sessions', {});

    await testCase.pos('delete session', async () => {
        await talaxy.delete(`/chat-sessions/${session.sessionId}`);
        await talaxy.negGet(`/chat-sessions/${session.sessionId}`);
    });

    return testCase;
}

module.exports = test;
