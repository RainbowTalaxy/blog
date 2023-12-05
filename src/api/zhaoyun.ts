import { SERVER_API } from '../constants/config';
import { GameMap } from '../constants/zhaoyun/Map';
import { Player } from '../constants/zhaoyun/Player';
import { rocketV2 } from './utils';

interface Team {
    players: Player[];
}

interface Round {
    map: GameMap;
    score_a: number;
    score_b: number;
}

interface Match {
    team_a: Team;
    team_b: Team;
    rounds: Round[];
}

export interface MatchDay {
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

export interface Statistics {
    updated_at: number;
    match_days: Array<{
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
