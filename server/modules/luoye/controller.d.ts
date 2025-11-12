import {
    Doc,
    DocBinItem,
    DocDir,
    DocItem,
    DocType,
    Scope,
    Workspace,
    WorkspaceItem,
} from './constants';

declare const Controller: {
    userFile: (userId: string) => {
        workspaces: string;
        docs: string;
        recentDocs: string;
        docBin: string;
    };
    user: (userId: string) => {
        workspaceItems: {
            content: WorkspaceItem[];
            add: (workspace: Workspace) => void;
            update: (workspace: Workspace) => void;
            remove: (workspaceId: string) => void;
        };
        docItems: {
            content: DocItem[];
            add: (doc: Doc) => void;
            update: (doc: Doc) => void;
            remove: (docId: string) => void;
        };
        recentDocs: {
            content: DocItem[];
            record: (docItem: DocItem) => void;
            remove: (docId: string) => void;
        };
        docBinItems: {
            content: DocBinItem[];
            add: (doc: Doc, executor: string) => void;
            remove: (docId: string) => void;
        };
    };
    workspace: {
        add: (
            props: {
                name?: string;
                description?: string;
                scope?: Scope;
            },
            creator: string,
            isDefault?: boolean,
        ) => Workspace;
        ctr: (workspaceId: string) => {
            content: Workspace;
            update: (props: {
                name?: string;
                description?: string;
                scope?: Scope;
                docs?: DocDir[];
            }) => Workspace;
            delete: () => void;
            addDoc: (doc: Doc) => void;
            updateDoc: (doc: Doc) => void;
            removeDoc: (docId: string) => void;
        } | null;
    };
    doc: {
        add: (
            props: {
                name?: string;
                scope?: Scope;
                date?: number;
                docType: DocType;
            },
            workspaceCtr: ReturnType<(typeof Controller)['workspace']['ctr']>,
            creator: string,
        ) => Doc;
        ctr: (docId: string) => {
            content: Doc;
            update: (props: {
                name?: string;
                scope?: Scope;
                date?: number;
                content?: string;
                workspaces?: string[];
            }) => Doc;
            remove: (executor: string) => void;
            restore: () => void;
            delete: () => void;
        } | null;
    };
    clear: () => void;
};

export = Controller;
