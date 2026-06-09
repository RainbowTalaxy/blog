declare function search(
    userId: string,
    keyword: string,
    options?: {
        workspaceId?: string;
        limit?: number;
    },
):
    | {
          id: string;
          name: string;
          updatedAt: number;
          matches: {
              field: 'name' | 'content';
              context: string;
          }[];
      }[]
    | null;

export { search };
