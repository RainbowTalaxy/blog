const PropList = {
    user: {
        workspaceItems: ['id', 'name', 'description', 'scope', 'joinAt'],
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
