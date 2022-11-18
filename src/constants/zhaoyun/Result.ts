import { Match } from './Matchs';
import { Player } from './Player';

export const RANK = (() => {
    const stat = new Map<
        Player,
        {
            score: number;
            matchTotal: number;
            win: number;
            loss: number;
            mapScore: number;
            amount: number;
        }
    >();
    const days = Match;
    days.forEach((day) => {
        day.matchs.forEach((match) => {
            let AScore = 0;
            let BScore = 0;
            match.rounds.forEach((round) => {
                if (round.A > round.B) {
                    AScore += 1;
                } else {
                    BScore += 1;
                }
            });
            let AWin = AScore > BScore ? 1 : 0;
            let BWin = AScore > BScore ? 0 : 1;
            match.teams.A.players.forEach((player) => {
                const targetPlayer = stat.get(player);
                if (targetPlayer) {
                    targetPlayer.win += AWin;
                    targetPlayer.loss += BWin;
                    targetPlayer.matchTotal += match.rounds.length;
                    targetPlayer.mapScore += AScore - BScore;
                    targetPlayer.amount += 100 * AWin;
                    targetPlayer.score += AWin - BWin;
                } else {
                    stat.set(player, {
                        win: AWin,
                        loss: BWin,
                        matchTotal: match.rounds.length,
                        mapScore: AScore - BScore,
                        amount: 100 * AWin,
                        score: AWin - BWin,
                    });
                }
            });
            match.teams.B.players.forEach((player) => {
                const targetPlayer = stat.get(player);
                if (targetPlayer) {
                    targetPlayer.win += BWin;
                    targetPlayer.loss += AWin;
                    targetPlayer.matchTotal += match.rounds.length;
                    targetPlayer.mapScore += BScore - AScore;
                    targetPlayer.amount += 100 * BWin;
                    targetPlayer.score += BWin - AWin;
                } else {
                    stat.set(player, {
                        win: BWin,
                        loss: AWin,
                        matchTotal: match.rounds.length,
                        mapScore: BScore - AScore,
                        amount: 100 * BWin,
                        score: BWin - AWin,
                    });
                }
            });
        });
    });
    const result = Array.from(stat);
    result.sort(([ap, ad], [bp, bd]) => {
        if (ad.score === bd.score) {
            if (ad.mapScore === bd.mapScore) {
                return 0;
            }
            return bd.mapScore - ad.mapScore;
        }
        return bd.score - ad.score;
    });
    return result;
})();
