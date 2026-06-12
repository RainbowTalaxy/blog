export interface ChatTextPart {
    schemaVersion: number;
    partId: string;
    type: 'text';
    content: string;
    createdAt: number;
}

export interface ChatToolPart {
    schemaVersion: number;
    partId: string;
    type: 'tool_call';
    toolName: string;
    runId: string;
    toolCallId?: string;
    input: Record<string, unknown>;
    output?: unknown;
    content?: string;
    status?: string;
    createdAt: number;
    updatedAt: number;
}

export interface ChatUnknownPart {
    schemaVersion: number;
    partId: string;
    type: string;
    createdAt: number;
    raw?: unknown;
}

export type ChatPart = ChatTextPart | ChatToolPart | ChatUnknownPart;

export interface ChatImageAttachment {
    id: string;
    url: string;
    name: string;
    mimeType: string;
    size: number;
}

export interface ChatUserMessage {
    schemaVersion: number;
    messageId: string;
    type: 'user_message';
    content: string;
    attachments?: ChatImageAttachment[];
    createdAt: number;
}

export interface ChatAssistantMessage {
    schemaVersion: number;
    messageId: string;
    type: 'assistant_message';
    parts: ChatPart[];
    createdAt: number;
}

export interface ChatUnknownMessage {
    schemaVersion: number;
    messageId: string;
    type: string;
    createdAt: number;
    raw?: unknown;
}

export type ChatMessage =
    | ChatUserMessage
    | ChatAssistantMessage
    | ChatUnknownMessage;

export interface ChatSessionData {
    schemaVersion: number;
    sessionId: string;
    userId: string;
    docId?: string;
    title: string;
    messages: ChatMessage[];
    docUpdatedAt?: number;
    createdAt: number;
    updatedAt: number;
}

export interface ChatSessionSummary {
    schemaVersion: number;
    sessionId: string;
    userId: string;
    docId?: string;
    title: string;
    messageCount: number;
    createdAt: number;
    updatedAt: number;
}

export type IsNonNullable = <T>(value: T | null | undefined) => value is T;
export type UserDir = (userId: string) => string;
export type SessionFile = (userId: string, sessionId: string) => string;
export type EnsureUserDir = (userId: string) => string;
export type Now = () => number;
export type MessageId = () => string;
export type PartId = () => string;
export type TitleFromContent = (
    content: unknown,
    attachments?: ChatImageAttachment[],
) => string;
export type NormalizeStatus = (value: unknown) => string;
export type NormalizeToolInput = (input: unknown) => Record<string, unknown>;
export type NormalizeImageAttachments = (
    input: unknown,
) => ChatImageAttachment[];
export type NormalizeTextPart = (part: any) => ChatTextPart;
export type NormalizeToolPart = (part: any) => ChatToolPart;
export type NormalizePart = (part: any) => ChatPart;
export type NormalizeUserMessage = (message: any) => ChatUserMessage;
export type NormalizeAssistantMessage = (
    message: any,
) => ChatAssistantMessage;
export type NormalizeMessage = (message: any) => ChatMessage;
export type NormalizeChatSession = (session: unknown) => ChatSessionData;
export type ToSummary = (session: ChatSessionData) => ChatSessionSummary;
export type ValidateMessage = (message: unknown) => boolean;
export type HasValidUserMessageContent = (
    message: ChatUserMessage,
) => boolean;

export interface ChatSessionController {
    CURRENT_SCHEMA_VERSION: number;
    MAX_SESSIONS: number;
    SESSION_TTL: number;
    normalizeChatSession: NormalizeChatSession;
    create: (
        userId: string,
        props?: {
            docId?: string;
            docUpdatedAt?: number;
        },
    ) => ChatSessionData;
    get: (userId: string, sessionId: string) => ChatSessionData | null;
    save: (session: Partial<ChatSessionData>) => ChatSessionData;
    list: (
        userId: string,
        query?: {
            docId?: string;
            limit?: number;
        },
    ) => ChatSessionSummary[];
    appendMessage: (
        userId: string,
        sessionId: string,
        message: unknown,
    ) => ChatSessionData | null;
    updateMeta: (
        userId: string,
        sessionId: string,
        props?: {
            title?: string;
            docUpdatedAt?: number;
        },
    ) => ChatSessionData | null;
    patchToolCall: (
        userId: string,
        sessionId: string,
        runId: string,
        patch?: {
            status?: string;
            output?: unknown;
            content?: string;
        },
    ) => ChatSessionData | null;
    delete: (userId: string, sessionId: string) => boolean;
    clear: () => void;
    cleanup: (userId: string) => void;
}

export declare const ChatSession: ChatSessionController;

export declare const normalizeChatSession: NormalizeChatSession;
