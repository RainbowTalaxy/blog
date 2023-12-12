type Player = string;
type Hero = string;
type MatchMode = string;
type GameMap = string;

interface Team {
    players: Player[];
    wolf?: {
        real: Player;
        fake: Player;
    };
}

interface Round {
    map: GameMap;
    scoreA: number;
    scoreB: number;
    ban: Hero[];
    wolf?: {
        voteA: Player;
        voteB: Player;
    };
}

interface Match {
    mode: MatchMode;
    teamA: Team;
    teamB: Team;
    rounds: Round[];
}

interface MatchDay {
    id: string;
    date: number;
    description: string;
    matches: Match[];
    createdAt: number;
    updatedAt: number;
    removed: boolean;
    creator: string;
    updater: string;
}

interface Statistics {
    updatedAt: number;
    matchDays: Array<{
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
