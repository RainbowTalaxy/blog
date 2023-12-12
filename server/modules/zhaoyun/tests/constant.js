const PropList = {
    statistics: {
        self: ['updatedAt', 'matchDays'],
        matchDay: ['id', 'date', 'description', 'matches'],
    },
    matchDay: [
        'id',
        'date',
        'description',
        'matches',
        'createdAt',
        'updatedAt',
        'removed',
        'creator',
        'updater',
    ],
    match: ['teamA', 'teamB', 'rounds'],
    round: ['map', 'scoreA', 'scoreB'],
    team: ['player'],
};

module.exports = PropList;
