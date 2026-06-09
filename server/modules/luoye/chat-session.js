// @ts-check

const fs = require('fs');
const path = require('path');
const { Dir } = require('../../config');
const { uuid } = require('../../utils');
const File = require('../../utils/file');

const CURRENT_SCHEMA_VERSION = 1;
const MAX_SESSIONS = 50;
const SESSION_TTL = 90 * 24 * 60 * 60 * 1000;
const DEFAULT_TITLE = '新会话';

const ChatDir = Dir.storage.luoye.chat;

/**
 * @typedef {import('./chat-session').ChatTextPart} ChatTextPart
 * @typedef {import('./chat-session').ChatToolPart} ChatToolPart
 * @typedef {import('./chat-session').ChatPart} ChatPart
 * @typedef {import('./chat-session').ChatUserMessage} ChatUserMessage
 * @typedef {import('./chat-session').ChatAssistantMessage} ChatAssistantMessage
 * @typedef {import('./chat-session').ChatMessage} ChatMessage
 * @typedef {import('./chat-session').ChatSessionData} ChatSessionData
 * @typedef {import('./chat-session').ChatSessionSummary} ChatSessionSummary
 */

/** @type {import('./chat-session').IsNonNullable} */
const isNonNullable = (value) => {
    return value !== null && value !== undefined;
};

/** @type {import('./chat-session').UserDir} */
const userDir = (userId) => {
    if (!userId) throw new Error('`userId` is required');
    return File.join(ChatDir, userId);
};

/** @type {import('./chat-session').SessionFile} */
const sessionFile = (userId, sessionId) => {
    return File.json(userDir(userId), sessionId);
};

/** @type {import('./chat-session').EnsureUserDir} */
const ensureUserDir = (userId) => {
    const dir = userDir(userId);
    if (!File.exists(dir)) File.mkdir(dir);
    return dir;
};

/** @type {import('./chat-session').Now} */
const now = () => {
    return Date.now();
};

/** @type {import('./chat-session').MessageId} */
const messageId = () => {
    return uuid();
};

/** @type {import('./chat-session').PartId} */
const partId = () => {
    return uuid();
};

/** @type {import('./chat-session').TitleFromContent} */
const titleFromContent = (content) => {
    const text = typeof content === 'string' ? content.trim() : '';
    if (!text) return DEFAULT_TITLE;
    return text.length > 20 ? `${text.slice(0, 20)}...` : text;
};

/** @type {import('./chat-session').NormalizeStatus} */
const normalizeStatus = (value) => {
    if (value === 'confirmed' || value === 'cancelled') return value;
    return 'pending';
};

/** @type {import('./chat-session').NormalizeToolInput} */
const normalizeToolInput = (input) => {
    if (input && typeof input === 'object' && !Array.isArray(input)) {
        return /** @type {Record<string, unknown>} */ (input);
    }
    return {};
};

/** @type {import('./chat-session').NormalizeTextPart} */
const normalizeTextPart = (part) => {
    const createdAt = part.createdAt || now();
    return {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        partId: part.partId || part.id || messageId(),
        type: 'text',
        content: typeof part.content === 'string' ? part.content : '',
        createdAt,
    };
};

/** @type {import('./chat-session').NormalizeToolPart} */
const normalizeToolPart = (part) => {
    const timestamp = part.createdAt || now();
    const toolName = part.toolName || part.name || '';
    const runId = part.runId || part.run_id || part.id || messageId();
    const content =
        typeof part.content === 'string'
            ? part.content
            : typeof part.output?.content === 'string'
            ? part.output.content
            : '';
    return {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        partId: part.partId || part.id || part.toolCallId || runId,
        type: 'tool_call',
        toolName,
        runId,
        toolCallId: part.toolCallId || part.tool_call_id,
        input: normalizeToolInput(part.input || part.args),
        output: part.output,
        content,
        ...(toolName === 'save_doc_request'
            ? { status: normalizeStatus(part.status || content) }
            : {}),
        createdAt: timestamp,
        updatedAt: part.updatedAt || timestamp,
    };
};

/** @type {import('./chat-session').NormalizePart} */
const normalizePart = (part) => {
    if (!part || typeof part !== 'object') return normalizeTextPart({});
    if (part.type === 'text') return normalizeTextPart(part);
    if (part.type === 'tool_call') return normalizeToolPart(part);
    if (part.role === 'tool') return normalizeToolPart(part);
    if (part.role === 'assistant') return normalizeTextPart(part);
    return {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        partId: part.partId || part.id || partId(),
        type: part.type || 'unknown',
        createdAt: part.createdAt || now(),
        raw: part,
    };
};

/** @type {import('./chat-session').NormalizeUserMessage} */
const normalizeUserMessage = (message) => {
    return {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        messageId: message.messageId || message.id || messageId(),
        type: 'user_message',
        content: typeof message.content === 'string' ? message.content : '',
        createdAt: message.createdAt || now(),
    };
};

/** @type {import('./chat-session').NormalizeAssistantMessage} */
const normalizeAssistantMessage = (message) => {
    const content = Array.isArray(message.content) ? message.content : [];
    const parts = Array.isArray(message.parts)
        ? message.parts
        : content.map(normalizePart);
    return {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        messageId: message.messageId || message.id || messageId(),
        type: 'assistant_message',
        parts: parts.map(normalizePart),
        createdAt: message.createdAt || now(),
    };
};

/** @type {import('./chat-session').NormalizeMessage} */
const normalizeMessage = (message) => {
    if (!message || typeof message !== 'object') {
        return normalizeAssistantMessage({});
    }
    if (message.type === 'user_message' || message.role === 'user') {
        return normalizeUserMessage(message);
    }
    if (message.type === 'assistant_message' || message.role === 'assistant') {
        return normalizeAssistantMessage(message);
    }
    return {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        messageId: message.messageId || message.id || messageId(),
        type: message.type || 'unknown_message',
        createdAt: message.createdAt || now(),
        raw: message,
    };
};

/** @type {import('./chat-session').NormalizeChatSession} */
const normalizeChatSession = (session) => {
    const raw = /** @type {any} */ (session);
    const timestamp = now();
    const messages = Array.isArray(raw?.messages)
        ? raw.messages.map(normalizeMessage)
        : [];
    const firstUserMessage = messages.find(
        (message) => message.type === 'user_message',
    );
    return {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        sessionId: raw?.sessionId || raw?.id || uuid(),
        userId: raw?.userId || '',
        ...(raw?.docId ? { docId: raw.docId } : {}),
        title: raw?.title || titleFromContent(firstUserMessage?.content),
        messages,
        ...(raw?.docUpdatedAt !== undefined
            ? { docUpdatedAt: raw.docUpdatedAt }
            : {}),
        createdAt: raw?.createdAt || timestamp,
        updatedAt: raw?.updatedAt || timestamp,
    };
};

/** @type {import('./chat-session').ToSummary} */
const toSummary = (session) => {
    return {
        schemaVersion: session.schemaVersion,
        sessionId: session.sessionId,
        userId: session.userId,
        ...(session.docId ? { docId: session.docId } : {}),
        title: session.title,
        messageCount: session.messages.length,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
    };
};

/** @type {import('./chat-session').ValidateMessage} */
const validateMessage = (message) => {
    if (!message || typeof message !== 'object') return false;
    const raw = /** @type {{ type?: unknown; role?: unknown }} */ (message);
    return (
        raw.type === 'user_message' ||
        raw.type === 'assistant_message' ||
        raw.role === 'user' ||
        raw.role === 'assistant'
    );
};

/** @type {import('./chat-session').ChatSessionController} */
const ChatSession = {
    CURRENT_SCHEMA_VERSION,
    MAX_SESSIONS,
    SESSION_TTL,
    normalizeChatSession,

    create(userId, props = {}) {
        ensureUserDir(userId);
        const timestamp = now();
        const session = {
            schemaVersion: CURRENT_SCHEMA_VERSION,
            sessionId: uuid(),
            userId,
            ...(props.docId ? { docId: props.docId } : {}),
            title: DEFAULT_TITLE,
            messages: [],
            ...(props.docUpdatedAt !== undefined
                ? { docUpdatedAt: props.docUpdatedAt }
                : {}),
            createdAt: timestamp,
            updatedAt: timestamp,
        };
        this.save(session);
        this.cleanup(userId);
        return session;
    },

    get(userId, sessionId) {
        const file = sessionFile(userId, sessionId);
        if (!File.exists(file)) return null;
        const raw = File.readJSON(file);
        const session = normalizeChatSession(raw);
        if (session.userId !== userId) return null;
        return session;
    },

    save(session) {
        const normalized = normalizeChatSession(session);
        ensureUserDir(normalized.userId);
        File.writeJSON(
            sessionFile(normalized.userId, normalized.sessionId),
            normalized,
        );
        return normalized;
    },

    list(userId, query = {}) {
        const dir = ensureUserDir(userId);
        const files = fs
            .readdirSync(dir)
            .filter((file) => file.endsWith('.json'));
        const sessions = files
            .map((file) => {
                try {
                    return this.get(userId, path.basename(file, '.json'));
                } catch {
                    return null;
                }
            })
            .filter(isNonNullable)
            .filter((session) => {
                if (!query.docId) return true;
                return session.docId === query.docId;
            })
            .sort((a, b) => b.updatedAt - a.updatedAt);
        const limit = query.limit || 20;
        return sessions.slice(0, limit).map(toSummary);
    },

    appendMessage(userId, sessionId, message) {
        if (!validateMessage(message)) return null;
        const session = this.get(userId, sessionId);
        if (!session) return null;
        const normalizedMessage = normalizeMessage(message);
        session.messages.push(normalizedMessage);
        if (
            session.title === DEFAULT_TITLE &&
            normalizedMessage.type === 'user_message' &&
            'content' in normalizedMessage
        ) {
            session.title = titleFromContent(normalizedMessage.content);
        }
        session.updatedAt = now();
        return this.save(session);
    },

    updateMeta(userId, sessionId, props = {}) {
        const session = this.get(userId, sessionId);
        if (!session) return null;
        if (typeof props.title === 'string') {
            const title = props.title.trim();
            if (title) session.title = title.slice(0, 80);
        }
        if (props.docUpdatedAt !== undefined) {
            session.docUpdatedAt = props.docUpdatedAt;
        }
        session.updatedAt = now();
        return this.save(session);
    },

    patchToolCall(userId, sessionId, runId, patch = {}) {
        const session = this.get(userId, sessionId);
        if (!session) return null;
        let matched = false;
        for (const message of session.messages) {
            if (message.type !== 'assistant_message' || !('parts' in message))
                continue;
            for (const part of message.parts) {
                if (part.type !== 'tool_call' || !('runId' in part)) continue;
                if (part.runId !== runId) continue;
                if (patch.status !== undefined) part.status = patch.status;
                if (patch.output !== undefined) part.output = patch.output;
                if (patch.content !== undefined) part.content = patch.content;
                part.updatedAt = now();
                matched = true;
            }
        }
        if (!matched) return null;
        session.updatedAt = now();
        return this.save(session);
    },

    delete(userId, sessionId) {
        const file = sessionFile(userId, sessionId);
        if (!File.exists(file)) return false;
        File.delete(file);
        return true;
    },

    clear() {
        if (File.exists(ChatDir)) File.rmdir(ChatDir);
        File.mkdir(ChatDir);
    },

    cleanup(userId) {
        const dir = ensureUserDir(userId);
        const files = fs
            .readdirSync(dir)
            .filter((file) => file.endsWith('.json'));
        const sessions = files
            .map((file) => {
                try {
                    const session = this.get(
                        userId,
                        path.basename(file, '.json'),
                    );
                    return session
                        ? { file, updatedAt: session.updatedAt }
                        : null;
                } catch {
                    return null;
                }
            })
            .filter(isNonNullable)
            .sort((a, b) => b.updatedAt - a.updatedAt);
        const timestamp = now();
        sessions.forEach((session, index) => {
            if (
                index >= MAX_SESSIONS ||
                timestamp - session.updatedAt > SESSION_TTL
            ) {
                File.delete(path.join(dir, session.file));
            }
        });
    },
};

module.exports = {
    ChatSession,
    normalizeChatSession,
};
