interface Team {
    players: string[];
}

interface Round {
    map: string;
    score_a: number;
    score_b: number;
}

interface Match {
    team_a: Team[];
    team_b: Team[];
    rounds: Round[];
}

interface MatchDay {
    id: string;
    date: number;
    description: string;
    matches: Match[];
    created_at: number;
    updated_at: number;
    removed: boolean;
    creator: string;
    updater: string;
}

interface Statistics {
    updated_at: number;
    match_days: Array<{
        id: string;
        date: number;
        description: string;
        matches: Match[];
    }>;
}

declare const Controller: {
    statistics: {
        content: Statistics;
        update: () => void;
    };
    matchDay: {
        add: (
            props: {
                date: number;
                description: string;
                matches: Match[];
            },
            creator: string,
        ) => MatchDay;
        ctr: (id: string) => {
            content: MatchDay;
            update: (
                props: {
                    date: number;
                    description: string;
                    matches: Match[];
                },
                updater: string,
            ) => MatchDay;
            remove: (remover: string) => void;
        } | null;
    };
};

export = Controller;
