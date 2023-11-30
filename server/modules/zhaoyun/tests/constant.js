const PropList = {
    statistics: {
        self: ['updated_at', 'match_days'],
        matchDay: ['id', 'date', 'description', 'matches'],
    },
    matchDay: [
        'id',
        'date',
        'description',
        'matches',
        'created_at',
        'updated_at',
        'removed',
        'creator',
        'updater',
    ],
    match: ['team_a', 'team_b', 'rounds'],
    round: ['map', 'score_a', 'score_b'],
    team: ['player'],
};

module.exports = PropList;
