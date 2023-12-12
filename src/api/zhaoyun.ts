import { SERVER_API } from '../constants/config';
import { Hero } from '../constants/zhaoyun/Hero';
import { GameMap } from '../constants/zhaoyun/Map';
import { Player } from '../constants/zhaoyun/Player';
import { MatchMode } from '../modules/zhaoyun/constants';
import { rocketV2 } from './utils';

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

export interface MatchDay {
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

export interface Statistics {
    updatedAt: number;
    matchDays: Array<{
        id: string;
        date: number;
        description: string;
        matches: Match[];
    }>;
}

interface MatchDayProps {
    date: number;
    description: string;
    matches: Match[];
}

const ZhaoyunAPI = {
    statistics: () =>
        rocketV2.get<Statistics>(`${SERVER_API}/zhaoyun/statistics`),
    matchDay: (id: string) =>
        rocketV2.get<MatchDay>(`${SERVER_API}/zhaoyun/match-day/${id}`),
    createMatchDay: (props: MatchDayProps) =>
        rocketV2.post<MatchDay>(`${SERVER_API}/zhaoyun/match-day`, props),
    updateMatchDay: (id: string, props: MatchDayProps) =>
        rocketV2.put<MatchDay>(`${SERVER_API}/zhaoyun/match-day/${id}`, props),
    deleteMatchDay: (id: string) =>
        rocketV2.delete<{
            success: boolean;
        }>(`${SERVER_API}/zhaoyun/match-day/${id}`),
};

export default ZhaoyunAPI;
