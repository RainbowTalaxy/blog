declare function search(
    userId: string,
    keyword?: string,
    options?: {
        workspaceId?: string;
        limit?: number;
        timeField?: 'updatedAt' | 'createdAt' | 'date';
        startTime?: number;
        endTime?: number;
    },
): {
    total: number;
    items: {
        id: string;
        name: string;
        updatedAt: number;
        matches: {
            field: 'name' | 'content';
            context: string;
        }[];
    }[];
} | null;

export { search };
