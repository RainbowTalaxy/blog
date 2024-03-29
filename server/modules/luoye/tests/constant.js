const PropList = {
    user: {
        workspaceItem: ['id', 'name', 'description', 'scope', 'joinAt'],
        docItem: [
            'id',
            'name',
            'creator',
            'scope',
            'docType',
            'createdAt',
            'updatedAt',
        ],
        docBinItem: ['docId', 'name', 'executor', 'deletedAt'],
    },
    workspace: [
        'id',
        'name',
        'description',
        'scope',
        'creator',
        'admins',
        'members',
        'docs',
        'createdAt',
        'updatedAt',
    ],
    docDir: ['docId', 'name', 'scope', 'updatedAt'],
    doc: [
        'id',
        'name',
        'creator',
        'admins',
        'members',
        'scope',
        'date',
        'workspaces',
        'docType',
        'content',
        'createdAt',
        'updatedAt',
        'deletedAt',
    ],
};

module.exports = PropList;
